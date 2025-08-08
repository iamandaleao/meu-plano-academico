
document.addEventListener("DOMContentLoaded", () => {
  const semestreId = 1;
  renderMaterias(semestreId);

  window.addMateria = (e, semestreId) => {
    e.preventDefault();
    const input = e.target.querySelector("input");
    const nome = input.value.trim();
    if (!nome) return;
    const materias = getMaterias(semestreId);
    materias.push({ nome, notas: {}, checks: {}, texto: "", livro: "", concluida: false });
    saveMaterias(semestreId, materias);
    input.value = "";
    renderMaterias(semestreId);
  };
});

function renderMaterias(semestreId) {
  const andamentoContainer = document.getElementById("materias-andamento");
  const concluidoContainer = document.getElementById("materias-concluidas");
  if (!andamentoContainer || !concluidoContainer) return;

  andamentoContainer.innerHTML = "";
  concluidoContainer.innerHTML = "";

  const materias = getMaterias(semestreId);

  materias.forEach((materia, index) => {
    const div = document.createElement("div");
    div.className = "materia-item";

    const contentId = `materia-content-${semestreId}-${index}`;

    div.innerHTML = `
      <h3 onclick="toggleMateria('${contentId}')">
        ${materia.nome}
        <span class="materia-actions">
          <button onclick="event.stopPropagation(); editarMateria(${semestreId}, ${index})">✏️</button>
          <button onclick="event.stopPropagation(); deleteMateria(${semestreId}, ${index})">🗑️</button>
          <button onclick="event.stopPropagation(); toggleConcluida(${semestreId}, ${index})">
            ${materia.concluida ? "↩️ Retomar" : "✔️ Concluir"}
          </button>
        </span>
      </h3>
      <div class="materia-content" id="${contentId}" style="display: none;">
        <label>Qtd. Agendas: <input type="number" value="${materia.notas.ag || ""}" onchange="updateNota(${semestreId}, ${index}, 'ag', this.value)"></label><br>
        <label>Nota 1 (20%): <input type="number" value="${materia.notas.n1 || ""}" onchange="updateNota(${semestreId}, ${index}, 'n1', this.value)"></label><br>
        <label>Nota 2 (20%): <input type="number" value="${materia.notas.n2 || ""}" onchange="updateNota(${semestreId}, ${index}, 'n2', this.value)"></label><br>
        <label>Nota 3 (60%): <input type="number" value="${materia.notas.n3 || ""}" onchange="updateNota(${semestreId}, ${index}, 'n3', this.value)"></label><br>
        <button onclick="calcularMedia(this)">Calcular Média</button>
        <div class="resultado"></div>
        <div class="checkbox-group">
          <label><input type="checkbox" ${materia.checks.a ? "checked" : ""} onchange="updateCheck(${semestreId}, ${index}, 'a', this.checked)"> Atividades</label>
          <label><input type="checkbox" ${materia.checks.p ? "checked" : ""} onchange="updateCheck(${semestreId}, ${index}, 'p', this.checked)"> Prova</label>
          <label><input type="checkbox" ${materia.checks.l ? "checked" : ""} onchange="updateCheck(${semestreId}, ${index}, 'l', this.checked)"> Leitura</label>
        </div>
        <textarea rows="2" placeholder="Anotações..." onchange="updateText(${semestreId}, ${index}, 'texto', this.value)">${materia.texto || ""}</textarea>
        <textarea rows="1" placeholder="Livro / Página..." onchange="updateText(${semestreId}, ${index}, 'livro', this.value)">${materia.livro || ""}</textarea>
      </div>
    `;

    if (materia.concluida) {
      concluidoContainer.appendChild(div);
    } else {
      andamentoContainer.appendChild(div);
    }
  });
}

function calcularMedia(btn) {
  const box = btn.parentElement;
  const n1 = parseFloat(box.querySelector('[onchange*="n1"]').value) || 0;
  const n2 = parseFloat(box.querySelector('[onchange*="n2"]').value) || 0;
  const n3 = parseFloat(box.querySelector('[onchange*="n3"]').value) || 0;
  const agendas = parseFloat(box.querySelector('[onchange*="ag"]').value) || 1;
  const media = ((n1 * 2) + (n2 * 2) + (n3 * 6)) / 10;
  const mediaFinal = (media / agendas).toFixed(2);
  box.querySelector(".resultado").innerText = `Média Final: ${mediaFinal}`;
}

function getMaterias(id) {
  return JSON.parse(localStorage.getItem(`semestre-${id}`)) || [];
}

function saveMaterias(id, data) {
  localStorage.setItem(`semestre-${id}`, JSON.stringify(data));
}

function updateNota(semestreId, index, campo, valor) {
  const materias = getMaterias(semestreId);
  materias[index].notas[campo] = parseFloat(valor);
  saveMaterias(semestreId, materias);
}

function updateCheck(semestreId, index, campo, valor) {
  const materias = getMaterias(semestreId);
  materias[index].checks[campo] = valor;
  saveMaterias(semestreId, materias);
}

function updateText(semestreId, index, campo, valor) {
  const materias = getMaterias(semestreId);
  materias[index][campo] = valor;
  saveMaterias(semestreId, materias);
}

function deleteMateria(semestreId, index) {
  const materias = getMaterias(semestreId);
  materias.splice(index, 1);
  saveMaterias(semestreId, materias);
  renderMaterias(semestreId);
}

function toggleMateria(id) {
  const content = document.getElementById(id);
  if (!content) return;
  content.style.display = content.style.display === "block" ? "none" : "block";
}

function editarMateria(semestreId, index) {
  const materias = getMaterias(semestreId);
  const novoNome = prompt("Editar nome da matéria:", materias[index].nome);
  if (novoNome) {
    materias[index].nome = novoNome;
    saveMaterias(semestreId, materias);
    renderMaterias(semestreId);
  }
}

function toggleConcluida(semestreId, index) {
  const materias = getMaterias(semestreId);
  materias[index].concluida = !materias[index].concluida;
  saveMaterias(semestreId, materias);
  renderMaterias(semestreId);
}
