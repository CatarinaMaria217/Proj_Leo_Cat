const form = document.getElementById('addForm');

form.addEventListener('submit', async (e) => {
  e.preventDefault();

  const name = document.getElementById('name').value;
  const dimensions = document.getElementById('dimensions').value;
  const material = document.getElementById('material').value;
  const price = parseFloat(document.getElementById('price').value);

  try {
    const response = await fetch('/api/add', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ Nome: name, Dimensões: dimensions, Material: material, Preço: price,})
    });

    const data = await response.json();
    console.log('Registro adicionado:', data);

    // Redireciona ou mostra mensagem de sucesso
    alert('Registro adicionado!');
    form.reset();
  } catch (err) {
    console.error('Erro ao adicionar registro:', err);
  }
});