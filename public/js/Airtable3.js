/* =========================
   0️⃣ ESTADO GLOBAL (SORT)
   ========================= */
let currentSortField = null;
let currentSortDir = "asc";

/* =========================
   1️⃣ FUNÇÃO PRINCIPAL
   ========================= */
async function loadAirtable(filters = {}) {
  try {
    const params = new URLSearchParams();

    // 🔹 FILTROS
    if (filters.nome) params.append("nome", filters.nome);
    if (filters.material) params.append("material", filters.material);
    if (filters.precoMin) params.append("precoMin", filters.precoMin);

    // 🔹 SORT (NOVO)
    if (filters.sortField) params.append("sortField", filters.sortField);
    if (filters.sortDir) params.append("sortDir", filters.sortDir);

    const url = `/api/airtable?${params.toString()}`;

    const res = await fetch(url);
    const data = await res.json();

    const tbody = document.querySelector("#tableView tbody");
    tbody.innerHTML = "";

    data.records.forEach(record => {
      const tr = document.createElement("tr");
      tr.innerHTML = `
        <td>${record.fields["Nome"] || ""}</td>
        <td>${record.fields["Dimensões"] || ""}</td>
        <td>${record.fields["Material"] || ""}</td>
        <td>${record.fields["Preço"] || ""}</td>
        <td class="actions-col">
          <button class="delete-btn" data-id="${record.id}">🗑️</button>
        </td>
      `;
      tbody.appendChild(tr);
    });

    // 🔹 DELETE
    document.querySelectorAll(".delete-btn").forEach(btn => {
      btn.addEventListener("click", async () => {
        const id = btn.dataset.id;
        if (!confirm("Tem certeza que deseja apagar este registro?")) return;
        await fetch(`/api/delete/${id}`, { method: "DELETE" });
        loadAirtable(filters);
      });
    });

  } catch (err) {
    console.error(err);
  }
}

/* =========================
   2️⃣ DOM READY
   ========================= */
document.addEventListener("DOMContentLoaded", () => {

  /* =========================
     SORT AO CLICAR NO HEADER
     ========================= */
  document.querySelectorAll("#tableView th[data-sort]").forEach(th => {
    th.addEventListener("click", () => {
      const field = th.dataset.sort;

      if (currentSortField === field) {
        currentSortDir = currentSortDir === "asc" ? "desc" : "asc";
      } else {
        currentSortField = field;
        currentSortDir = "asc";
      }

      loadAirtable({
        nome: document.getElementById("filterNome")?.value,
        material: document.getElementById("filterMaterial")?.value,
        precoMin: document.getElementById("filterPreco")?.value,
        sortField: currentSortField,
        sortDir: currentSortDir
      });

      // 🔹 indicador visual (opcional)
      document.querySelectorAll("#tableView th").forEach(h =>
        h.classList.remove("asc", "desc")
      );
      th.classList.add(currentSortDir);
    });
  });

  /* =========================
     APLICAR FILTROS (MODAL)
     ========================= */
  const applyFiltersBtn = document.getElementById("applyFilters");

  if (applyFiltersBtn) {
    applyFiltersBtn.addEventListener("click", () => {
      const nome = document.getElementById("filterNome").value;
      const material = document.getElementById("filterMaterial").value;
      const precoMin = document.getElementById("filterPreco").value;

      loadAirtable({
        nome,
        material,
        precoMin,
        sortField: currentSortField,
        sortDir: currentSortDir
      });
    });
  }

  /* =========================
     SIDEBAR PERFIL
     ========================= */
  const sidebar = document.getElementById("sidebar");
  const sidebarTitle = document.getElementById("sidebarTitle");
  const sidebarBody = document.getElementById("sidebarBody");
  const showSidebarBtn = document.getElementById("showNameSidebar");
  const closeSidebarBtn = document.getElementById("closeSidebar");

  if (showSidebarBtn) {
    showSidebarBtn.addEventListener("click", (e) => {
      e.preventDefault();
      sidebarTitle.textContent = "Perfil";
      sidebarBody.innerHTML = `
        <p><strong>Nome:</strong> João Silva</p>
        <p><strong>Cargo:</strong> Gestor</p>
        <p><strong>Email:</strong> joao@empresa.com</p>
      `;
      sidebar.classList.add("open");
    });
  }

  if (closeSidebarBtn) {
    closeSidebarBtn.addEventListener("click", () => {
      sidebar.classList.remove("open");
    });
  }

  /* =========================
     MODAL URN
     ========================= */
  const urnLink = document.querySelector('a[href=""][data-action="urn"]');
  const urnModal = document.getElementById("urnModal");
  const urnClose = urnModal?.querySelector(".close");

  if (urnLink && urnModal && urnClose) {
    urnLink.addEventListener("click", e => {
      e.preventDefault();
      urnModal.style.display = "block";
    });

    urnClose.addEventListener("click", () => {
      urnModal.style.display = "none";
    });

    window.addEventListener("click", e => {
      if (e.target === urnModal) urnModal.style.display = "none";
    });
  }
});

/* =========================
   3️⃣ MODAL FILTER (BOTÃO)
   ========================= */
const filterBtn = document.getElementById("filterProduct");
const filterModal = document.getElementById("filterModal");
const closeFilterModal = filterModal?.querySelector(".close");

if (filterBtn && filterModal) {
  filterBtn.addEventListener("click", () => {
    filterModal.style.display = "block";
  });
}

if (closeFilterModal) {
  closeFilterModal.addEventListener("click", () => {
    filterModal.style.display = "none";
  });
}

window.addEventListener("click", e => {
  if (e.target === filterModal) {
    filterModal.style.display = "none";
  }
});

/* =========================
   4️⃣ LOAD INICIAL
   ========================= */
loadAirtable();

const exportBtn = document.getElementById("exportExcel");

if (exportBtn) {
  exportBtn.addEventListener("click", () => {
    const params = new URLSearchParams();

    const nome = document.getElementById("filterNome")?.value;
    const material = document.getElementById("filterMaterial")?.value;
    const precoMin = document.getElementById("filterPreco")?.value;

    if (nome) params.append("nome", nome);
    if (material) params.append("material", material);
    if (precoMin) params.append("precoMin", precoMin);

    if (currentSortField) params.append("sortField", currentSortField);
    if (currentSortDir) params.append("sortDir", currentSortDir);

    // 🔽 abre download
    window.location.href = `/api/export-excel?${params.toString()}`;
  });
}
