
/* =========================
   1️⃣ FUNÇÃO PRINCIPAL
   ========================= */
async function loadAirtable(filters = {}) {
  try {
    const params = new URLSearchParams();

    if (filters.nome) params.append("nome", filters.nome);
    if (filters.material) params.append("material", filters.material);
    if (filters.precoMin) params.append("precoMin", filters.precoMin);

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

    // DELETE
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

  /* ---- BOTÕES FILTER / SEARCH ---- */
  const openFiltersBtn = document.getElementById("openFilters");
  const openSearchBtn = document.getElementById("openSearch");
  const filtersPanel = document.getElementById("filtersPanel");

  if (openFiltersBtn && filtersPanel) {
    openFiltersBtn.addEventListener("click", () => {
      filtersPanel.style.display =
        filtersPanel.style.display === "none" ? "block" : "none";
    });
  }

  if (openSearchBtn && filtersPanel) {
    openSearchBtn.addEventListener("click", () => {
      filtersPanel.style.display = "block";
      document.getElementById("filterNome")?.focus();
    });
  }

  /* ---- APLICAR FILTROS ---- */
  const applyFiltersBtn = document.getElementById("applyFilters");

  if (applyFiltersBtn) {
    applyFiltersBtn.addEventListener("click", () => {
      const nome = document.getElementById("filterNome").value;
      const material = document.getElementById("filterMaterial").value;
      const precoMin = document.getElementById("filterPreco").value;

      loadAirtable({ nome, material, precoMin });
    });
  }

  /* ---- SEARCH EM TEMPO REAL (opcional mas útil) ---- */
  const filterNomeInput = document.getElementById("filterNome");
  if (filterNomeInput) {
    filterNomeInput.addEventListener("keyup", () => {
      loadAirtable({
        nome: filterNomeInput.value,
        material: document.getElementById("filterMaterial").value,
        precoMin: document.getElementById("filterPreco").value
      });
    });
  }

  /* ---- SIDEBAR PERFIL ---- */
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

  /* ---- MODAL URN ---- */
  const urnLink = document.querySelector('a[href=""][data-action="urn"]');
  const modal = document.getElementById("urnModal");
  const closeBtn = document.querySelector(".modal .close");

  if (urnLink && modal && closeBtn) {
    urnLink.addEventListener("click", (e) => {
      e.preventDefault();
      modal.style.display = "block";
    });

    closeBtn.addEventListener("click", () => {
      modal.style.display = "none";
    });

    window.addEventListener("click", (e) => {
      if (e.target === modal) modal.style.display = "none";
    });
  }
});

/* =========================
   3️⃣ LOAD INICIAL
   ========================= */
loadAirtable();

const filterBtn = document.getElementById("filterProduct");
const filterModal = document.getElementById("filterModal");
const closeFilterModal = filterModal.querySelector(".close");

if (filterBtn && filterModal) {
  filterBtn.addEventListener("click", () => {
    filterModal.style.display = "block";
  });
}

closeFilterModal.addEventListener("click", () => {
  filterModal.style.display = "none";
});

window.addEventListener("click", (e) => {
  if (e.target === filterModal) {
    filterModal.style.display = "none";
  }
});

if (toggleGroup && filterModal) {
  toggleGroup.addEventListener("click", (e) => {
    if (e.target.tagName !== "BUTTON") return;

    const label = e.target.textContent.trim().toLowerCase();

    if (label === "filter") {
      filterModal.style.display = "block";
    }

    if (label === "search") {
      filterModal.style.display = "block";
      document.getElementById("filterNome")?.focus();
    }
  });
}

const closeBtn = document.querySelector("#filterModal .close");

closeBtn.addEventListener("click", () => {
  filterModal.style.display = "none";
});

window.addEventListener("click", (e) => {
  if (e.target === filterModal) {
    filterModal.style.display = "none";
  }
});