const URL = "/api/proxy";

let usuarioLogado = null;
let emailLogado = null;

/* ================= carregamento ================= */
function setLoading(button, isLoading) {
  if (!button) return;

  if (isLoading) {
    button.disabled = true;
    button.classList.add("loading");
  } else {
    button.disabled = false;
    button.classList.remove("loading");
  }
}

const admins = [
  "cerqueira@fortsat.com.br",
  "bruno@fortsat.com.br",
  "igor@fortsat.com.br",
  "henrique@fortsunbrasil.com"
];

/* ================= LOGIN ================= */

function fazerLogin() {
  const email = document.getElementById("emailLogin").value.trim().toLowerCase();

  if (!email) {
    document.getElementById("erroLogin").innerText = "Digite um email";
    return;
  }

  const usuarios = {
    "cerqueira@fortsat.com.br": "CERQUEIRA",
    "bruno@fortsat.com.br": "BRUNO",
    "igor@fortsat.com.br": "PEDRO IGOR",
    "moraiselisergio@gmail.com": "ELISERGIO MORAIS",
    "jonathansousa0648@gmail.com": "FRANCISCO JONATHAN",
    "menezesrafael758@gmail.com": "RAFAEL MENEZES",
    "pedrorafael@fortsat.com.br": "PEDRO THE",
    "valdeniofilho05@gmail.com": "ANTONIO VALDENIO",
    "daniel@fortsat.com.br": "DANIEL FORTSAT",
    "georgiercles.190@gmail.com": "GEORGERCLES HONORIO",
    "marciocarvalho1512@gmail.com": "MARCIO THE",
    "marciosampaioslc@gmail.com": "MÁRCIO SAMPAIO",
    "henrique@fortsunbrasil.com": "HENRIQUE"
  };

  if (!usuarios[email]) {
    document.getElementById("erroLogin").innerText = "Email não autorizado";
    return;
  }

  const nome = usuarios[email];
  localStorage.setItem("usuarioLogado", nome);
  localStorage.setItem("emailLogado", email);

  iniciarSistema(nome, email);
}

/* ================= COR POR INICIAL ================= */
function gerarCorPorInicial(letra) {
  const cores = [
    "#1abc9c", "#2ecc71", "#3498db",
    "#9b59b6", "#e67e22", "#e74c3c",
    "#16a085", "#27ae60", "#2980b9",
    "#8e44ad", "#d35400", "#c0392b"
  ];

  const index = letra.charCodeAt(0) % cores.length;
  return cores[index];
}

/* ================= iniciar sistema ================= */
function iniciarSistema(nome, email) {
  usuarioLogado = nome;
  emailLogado = email || localStorage.getItem("emailLogado");

 
  document.getElementById("nomeUsuario").innerText = nome;
  document.getElementById("emailUsuario").innerText = emailLogado;

 
  const inicial = nome.trim().charAt(0).toUpperCase();
  document.getElementById("avatarUsuario").innerText = inicial;

  if (admins.includes(emailLogado)) {
    document.getElementById("btnLooker")?.style.setProperty("display", "block");
  }

  document.getElementById("loginScreen").style.display = "none";
  document.getElementById("sistema").style.display = "flex";

  travarMotoristas(nome);
}

/* ================= trava motorista ================= */
function travarMotoristas(nome) {
  const selects = [
    "motoristaSaida",
    "motoristaChegada",
    "motoristaAbastecimento",
    "motoristaManutencao",
    "motoristaLavagem"
  ];

  selects.forEach(id => {
    const select = document.getElementById(id);
    if (!select) return;
    select.innerHTML = `<option value="${nome}">${nome}</option>`;
    select.disabled = true;
  });
}

function logout() {
  localStorage.clear();
  location.reload();
}

function abrirLooker() {
  window.open("https://lookerstudio.google.com/u/0/reporting/e207d05d-30cf-460f-882d-b29297404ed8/page/eFFqF", "_blank");
}

/* ================= MENU ================= */

function toggleMenu() {
  const menu = document.querySelector(".menu-lateral");
  const overlay = document.querySelector(".overlay");

  const aberto = menu.classList.toggle("open");
  overlay.classList.toggle("show");

  document.body.style.overflow = aberto ? "hidden" : "auto";
}
/* ================= trocar abas ================= */
function trocarTela(id, event) {
  document.querySelectorAll(".conteudo").forEach(div => div.classList.remove("ativo"));
  document.querySelectorAll(".menu-btn").forEach(btn => btn.classList.remove("active"));

  document.getElementById(id)?.classList.add("ativo");
  event?.target.classList.add("active");

  document.querySelector(".menu-lateral")?.classList.remove("open");
  document.querySelector(".overlay")?.classList.remove("show");
}

function mostrarAba(id, event) {
  document.querySelectorAll(".aba").forEach(div => div.classList.remove("ativa"));
  document.querySelectorAll(".tab").forEach(btn => btn.classList.remove("active"));

  document.getElementById(id)?.classList.add("ativa");
  event?.target.classList.add("active");
}

/* ================= CARROS ================= */

const carros = [
  "FIAT/FIORINO - SBH4H88",
  "PAJERO LUCIANO - OCG8657",
  "M.BENZ 1016 - POI6D09",
  "M.BENZ FURGÃO - POS3A77",
  "M.BENZ 815 THE - RIJOE17",
  "M.BENZ 815 VERMELHO - RQZ6F04",
  "M.BENZ FURGÃO - SBT0D15",
  "M.BENZ 817 - SOC4J52",
  "VW GOL - OJU9697",
  "IVECO 130 - OSK7870"
];
/* ================= DETECTAR QR DO VEÍCULO ================= */

async function detectarQRVeiculo() {

  const params = new URLSearchParams(window.location.search);
  const id = params.get("veiculo");

  if (!id) return;

  const carro = carros[id - 1];
  if (!carro) return;

  // preencher selects automaticamente
  const selects = [
    "carroSaida",
    "carroChegada",
    "carroAbastecimento",
    "carroManutencao",
    "carroLavagem"
  ];

  selects.forEach(selectId => {
    const select = document.getElementById(selectId);
    if (select) select.value = carro;
  });

  try {

    const response = await fetch(`${URL}?tipo=ROTAS_ABERTAS`);
    const data = await response.json();

    const rota = data.rotasAbertas.find(r => r.carro === carro);

    if (rota) {

      trocarTela("rotas");
      mostrarAba("chegada");

      mostrarToast("🚗 Veículo com rota aberta. Registrar chegada.");

    } else {

      trocarTela("rotas");
      mostrarAba("saida");

      mostrarToast("🚗 Registrar saída do veículo.");

    }

  } catch {
    console.log("Erro ao verificar rotas abertas");
  }
}

/* ================= Toast ================= */

function mostrarToast(mensagem, tipo = "success") {
  const container = document.getElementById("toastContainer");
  if (!container) return;

  const toast = document.createElement("div");
  toast.classList.add("toast", tipo);
  toast.innerHTML = `<span>${mensagem}</span><button>&times;</button>`;

  container.appendChild(toast);
  toast.querySelector("button").addEventListener("click", () => toast.remove());
  setTimeout(() => toast.remove(), 2000);
}

/* ================= BUSCAR ÚLTIMO KM ================= */

async function buscarUltimoKm(carro) {
  try {
    const response = await fetch(`${URL}?tipo=ULTIMO_KM&carro=${encodeURIComponent(carro)}`);
    const data = await response.json();
    return Number(data.km) || 0;
  } catch {
    return 0;
  }
}


async function enviar(tipo, dados) {
  try {
    const response = await fetch(URL, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({ tipo, ...dados })
    });

    const data = await response.json();
    if (data.erro) return { success: false, message: data.erro };

    return { success: true, data };

  } catch {
    return { success: false, message: "Sem conexão com o servidor." };
  }
}

/* ================= INICIALIZAÇÃO ================= */
document.addEventListener("DOMContentLoaded", async () => {

  /* ================= RESTAURA LOGIN ================= */

  const salvo = localStorage.getItem("usuarioLogado");
  const emailSalvo = localStorage.getItem("emailLogado");
  if (salvo) iniciarSistema(salvo, emailSalvo);

  /* ================= POPULAR VEÍCULOS ================= */

  ["carroSaida","carroChegada","carroAbastecimento","carroManutencao","carroLavagem"]
  .forEach(id => {
    const select = document.getElementById(id);
    if (!select) return;

    select.innerHTML = `<option value="">Selecione Veículo</option>`;
    carros.forEach(carro => {
      select.innerHTML += `<option value="${carro}">${carro}</option>`;
    });
  });

  /* ================= DETECTAR QR ================= */

  detectarQRVeiculo();

});
 
/* ================= PREVENTIVA  ================= */

const tipoPreventiva = document.getElementById("tipoPreventiva");
const kmProximaTroca = document.getElementById("kmProximaTroca");
const grupoPneus = document.getElementById("grupoPneus");
const tipoReparoPneu = document.getElementById("tipoReparoPneu");
tipoPreventiva?.addEventListener("change", function () {

  const tipo = this.value;

  // Sempre mostrar KM limite
  kmProximaTroca.style.display = "block";
  kmProximaTroca.required = false;
  kmProximaTroca.value = "";

  // Reset pneus
  grupoPneus.style.display = "none";
  tipoReparoPneu.style.display = "none";

  document.querySelectorAll("input[name='posicaoPneu']")
    .forEach(cb => cb.checked = false);

  // Óleo → obrigatório
  if (tipo === "OLEO") {
    kmProximaTroca.required = true;
  }

  // Pneu → mostrar pneus + tipo de reparo
  if (tipo === "PNEU") {
    grupoPneus.style.display = "block";
    tipoReparoPneu.style.display = "block";
  }

});
  /* ================= SAÍDA ================= */
document.getElementById("formSaida")?.addEventListener("submit", async e => {
  e.preventDefault();

  const button = e.target.querySelector("button[type='submit']");
  setLoading(button, true);

  try {

    const f = new FormData(e.target);
    const carro = f.get("carro");
    const km = Number(f.get("km"));

    if (!carro) {
      mostrarToast("Selecione um veículo!", "error");
      return;
    }

    const ultimoKm = await buscarUltimoKm(carro);

    if (ultimoKm && km < ultimoKm) {
      mostrarToast(`❌ KM menor que o último (${ultimoKm})`, "error");
      return;
    }

    const resposta = await enviar("SAIDA", {
      motorista: usuarioLogado,
      carro,
      km,
      regiao: f.get("regiao"),
      tipoServico: f.get("tipoServico")
    });

    if (!resposta.success) {
      mostrarToast(`❌ ${resposta.message}`, "error");
      return;
    }

    mostrarToast("✅ Saída registrada!");
    e.target.reset();

  } finally {
    setLoading(button, false);
  }
});

  /* ================= CHEGADA ================= */
document.getElementById("formChegada")?.addEventListener("submit", async e => {
  e.preventDefault();

  const button = e.target.querySelector("button[type='submit']");
  setLoading(button, true);

  try {

    const f = new FormData(e.target);
    const carro = f.get("carro");
    const km = Number(f.get("km"));

    if (!carro) {
      mostrarToast("Selecione um veículo!", "error");
      return;
    }

    const ultimoKm = await buscarUltimoKm(carro);

    if (ultimoKm && km < ultimoKm) {
      mostrarToast(`❌ KM inválido! Último KM: ${ultimoKm}`, "error");
      return;
    }

    const resposta = await enviar("CHEGADA", {
      motorista: usuarioLogado,
      carro,
      km
    });

    if (!resposta.success) {
      mostrarToast(`❌ ${resposta.message}`, "error");
      return;
    }

    mostrarToast("🚗 Chegada registrada!");
    e.target.reset();

  } finally {
    setLoading(button, false);
  }
});

  /* ================= ABASTECIMENTO ================= */
document.getElementById("formAbastecimento")?.addEventListener("submit", async e => {
  e.preventDefault();

  const button = e.target.querySelector("button[type='submit']");
  setLoading(button, true);

  try {

    const f = new FormData(e.target);

    if (!f.get("carro")) {
      mostrarToast("Selecione um veículo!", "error");
      return;
    }

    const resposta = await enviar("ABASTECIMENTO", {
      motorista: usuarioLogado,
      carro: f.get("carro"),
      litros: f.get("litros"),
      valor: f.get("valor")
    });

    if (!resposta.success) {
      mostrarToast(`❌ ${resposta.message}`, "error");
      return;
    }

    mostrarToast("⛽ Abastecimento registrado!");
    e.target.reset();

  } finally {
    setLoading(button, false);
  }
});



  /* ================= MANUTENÇÃO ================= */
document.getElementById("formManutencao")?.addEventListener("submit", async e => {
  e.preventDefault();

  const button = e.target.querySelector("button[type='submit']");
  setLoading(button, true);

  try {

    const f = new FormData(e.target);

    if (!f.get("carro")) {
      mostrarToast("Selecione um veículo!", "error");
      return;
    }

    // 🔧 Se for PNEU → pegar múltiplos checkboxes
    let pneusSelecionados = "";

    if (f.get("tipoPreventiva") === "PNEU") {

      const selecionados = document.querySelectorAll("input[name='posicaoPneu']:checked");

      if (selecionados.length === 0) {
        mostrarToast("Selecione pelo menos um pneu!", "error");
        return;
      }

      pneusSelecionados = [...selecionados]
        .map(el => el.value)
        .join(", ");
    }

    const resposta = await enviar("MANUTENCAO", {
  motorista: usuarioLogado,
  carro: f.get("carro"),
  km: f.get("km"),
  valor: f.get("valor"),
  descricao: f.get("descricao"),
  tipoPreventiva: f.get("tipoPreventiva"),
  kmProximaTroca: f.get("kmProximaTroca"),
  posicaoPneu: pneusSelecionados,
  tipoReparo: f.get("tipoReparo")
});

    if (!resposta.success) {
      mostrarToast(`❌ ${resposta.message}`, "error");
      return;
    }

    mostrarToast("🔧 Manutenção registrada!");

    e.target.reset();
    document.getElementById("grupoPneus").style.display = "none";
    document.getElementById("kmProximaTroca").style.display = "none";

  } finally {
    setLoading(button, false);
  }
});
  /* ================= LAVAGEM ================= */
document.getElementById("formLavagem")?.addEventListener("submit", async e => {
  e.preventDefault();

  const button = e.target.querySelector("button[type='submit']");
  setLoading(button, true);

  try {

    const f = new FormData(e.target);
    const carro = f.get("carro");
    const valor = Number(f.get("valor"));
    const descricao = f.get("descricao");

    if (!carro) {
      mostrarToast("Selecione um veículo!", "error");
      return;
    }

    if (!valor || valor <= 0) {
      mostrarToast("Informe um valor válido!", "error");
      return;
    }

    const resposta = await enviar("LAVAGEM", {
      motorista: usuarioLogado,
      carro,
      valor,
      descricao
    });

    if (!resposta.success) {
      mostrarToast(`❌ ${resposta.message}`, "error");
      return;
    }

    mostrarToast("🧼 Lavagem registrada!");
    e.target.reset();

  } finally {
    setLoading(button, false);
  }
});
/* ================= PWA ================= */

if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker
      .register("service-worker.js")
      .then(reg => {
        console.log("PWA ativa 🚀");
      })
      .catch(err => {
        console.log("Erro ao registrar SW:", err);
      });
  });
}
document.addEventListener("DOMContentLoaded", () => {
  document.body.classList.remove("menu-open");
  document.body.style.overflow = "auto";
});
