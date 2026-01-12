
    fetch('/api/airtable')
      .then(res => res.json())
      .then(data => {
        const tbody = document.querySelector('#tableView tbody');
        data.records.forEach(record => {
          const tr = document.createElement('tr');
          tr.innerHTML = `
              <td>${record.fields["Nome"] || ''}</td>
              <td>${record.fields["Dimensões"] || ''}</td>
              <td>${record.fields["Material"] || ''}</td>
              <td>${record.fields["Preço"] || ''}</td>
            <td>
            <td class="actions-col">
              <button class="delete-btn" onclick="deleteRow(this, '${record.id}')">🗑️</button>
            </td>
            `;
          tbody.appendChild(tr);
        });
      })
      .catch(err => console.error(err));

  async function loadAirtable() {
    try {
      const res = await fetch('/api/airtable');
      const data = await res.json();
      const tbody = document.querySelector('#tableView tbody');
      tbody.innerHTML = ''; // clear table

      data.records.forEach(record => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
          <td>${record.fields["Nome"] || ''}</td>
          <td>${record.fields["Dimensões"] || ''}</td>
          <td>${record.fields["Material"] || ''}</td>
          <td>${record.fields["Preço"] || ''}</td>
          <td>
            <button class="delete-btn" data-id="${record.id}">🗑️</button>
          </td>
        `;
        tbody.appendChild(tr);
      });

      // Attach delete events
      document.querySelectorAll('.delete-btn').forEach(btn => {
        btn.addEventListener('click', async () => {
          const id = btn.getAttribute('data-id');
          if (!confirm("Tem certeza que deseja apagar este registro?")) return;

          try {
            await fetch(`/api/delete/${id}`, { method: 'DELETE' });
            alert("Registro apagado!");
            loadAirtable(); // reload table
          } catch (err) {
            console.error(err);
            alert("Erro ao apagar.");
          }
        });
      });

    } catch (err) {
      console.error(err);
    }
  }

  // Load table on page load
  loadAirtable();

  document.addEventListener("DOMContentLoaded", () => {
    const sidebar = document.getElementById("sidebar");
    const sidebarTitle = document.getElementById("sidebarTitle");
    const sidebarBody = document.getElementById("sidebarBody");
    const showSidebarBtn = document.getElementById("showNameSidebar");
    const closeSidebarBtn = document.getElementById("closeSidebar");

    // Abre a sidebar
    showSidebarBtn.addEventListener("click", (e) => {
      e.preventDefault(); // evita que a página role para o topo
      sidebarTitle.textContent = "Perfil";
      sidebarBody.innerHTML = `
        <p><strong>Nome:</strong> João Silva</p>
        <p><strong>Cargo:</strong> Gestor</p>
        <p><strong>Email:</strong> joao@empresa.com</p>
      `;
      sidebar.classList.add("open");
    });

    // Fecha a sidebar
    closeSidebarBtn.addEventListener("click", () => {
      sidebar.classList.remove("open");
    });
  });

    const urnLink = document.querySelector('a[href=""][data-action="urn"]');
    const modal = document.getElementById("urnModal");
    const closeBtn = document.querySelector(".modal .close");

    // abrir modal ao clicar em URN
    urnLink.addEventListener("click", (e) => {
      e.preventDefault();
      modal.style.display = "block";
    });

    // fechar no X
    closeBtn.addEventListener("click", () => {
      modal.style.display = "none";
    });

    // fechar ao clicar fora
    window.addEventListener("click", (e) => {
      if (e.target == modal) modal.style.display = "none";
    });

