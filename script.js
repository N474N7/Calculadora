const caixaDtexto = document.querySelector('.resulta');
const historicoLista = [];
const LIMITE_DIGITOS = 12;

let expressao = "";
let valorAnterior = null;
let operadorAtual = null;
let novoNumero = false;
let porcentagemGuardada = null;
let modoPorcentagem = false;

// HISTÓRICO
function historico() {
  if (historicoLista.length === 0) {
    alert("Histórico vazio");
  } else {
    alert("Histórico:\n" + historicoLista.slice(-5).reverse().join("\n"));
  }
}

// LIMPAR
function C() {
  expressao = "";
  valorAnterior = null;
  operadorAtual = null;
  novoNumero = false;
  porcentagemGuardada = null;
  modoPorcentagem = false;
  caixaDtexto.value = "";
}

// APAGAR
function apagar() {
  if (expressao.length > 0) {
    expressao = expressao.slice(0, -1);
  } else if (valorAnterior !== null) {
    expressao = valorAnterior;
    valorAnterior = null;
    operadorAtual = null;
    novoNumero = false;
  }
  atualizarDisplay();
}

// PARÊNTESES AUTOMÁTICOS
function colchetes() {
  const abre = expressao.split('(').length;
  const fecha = expressao.split(')').length;
  expressao += abre > fecha ? ")" : "(";
  atualizarDisplay();
}

// PORCENTAGEM 
function porcentagem() {
  if (!expressao) return;
  porcentagemGuardada = parseFloat(expressao);
  modoPorcentagem = true;
  expressao = "";
  novoNumero = true;
  caixaDtexto.value = "%";
}

// INVERTE SINAL 
function trocaSinal() {
  if (!expressao) return;
  if (expressao.startsWith("-")) {
    expressao = expressao.slice(1);
  } else {
    expressao = "-" + expressao;
  }
  atualizarDisplay();
}

// PONTO DECIMAL
function ponto() { adicionar("."); }

// NÚMEROS
function zero() { adicionar("0"); }
function um() { adicionar("1"); }
function dois() { adicionar("2"); }
function tres() { adicionar("3"); }
function quatro() { adicionar("4"); }
function cinco() { adicionar("5"); }
function seis() { adicionar("6"); }
function sete() { adicionar("7"); }
function oito() { adicionar("8"); }
function nove() { adicionar("9"); }

// OPERADORES
function adicionarOperador(op) {
  if (expressao === "" && valorAnterior === null) return;
  if (!novoNumero) {
    if (expressao !== "") {
      valorAnterior = expressao;
    }
    operadorAtual = op;
    novoNumero = true;
    caixaDtexto.value = op;
    expressao = "";
  } else {
    operadorAtual = op;
    caixaDtexto.value = op;
  }
}

function soma() { adicionarOperador("+"); }
function subritracao() { adicionarOperador("-"); }
function multiplicacao() { adicionarOperador("*"); }
function divisao() { adicionarOperador("/"); }

// ADICIONAR AO DISPLAY
function adicionar(caractere) {
  if (novoNumero) {
    expressao = caractere;
    novoNumero = false;
  } else if (expressao.length < LIMITE_DIGITOS) {
    expressao += caractere;
  }
  atualizarDisplay();
}

// ATUALIZAR DISPLAY COM LIMITE
function atualizarDisplay() {
  caixaDtexto.value = expressao.slice(0, LIMITE_DIGITOS);
}

// RESULTADO FINAL
function resultado() {
  if (modoPorcentagem && porcentagemGuardada !== null && expressao !== "") {
    try {
      const base = parseFloat(expressao);
      const res = (porcentagemGuardada / 100) * base;
      historicoLista.push(`${porcentagemGuardada}% de ${base} = ${res}`);
      expressao = res.toString().slice(0, LIMITE_DIGITOS);
      caixaDtexto.value = expressao;
    } catch {
      caixaDtexto.value = "Erro";
      expressao = "";
    }
    porcentagemGuardada = null;
    modoPorcentagem = false;
    valorAnterior = null;
    operadorAtual = null;
    novoNumero = false;
    return;
  }

  if (valorAnterior === null || operadorAtual === null || expressao === "") return;
  try {
    const val1 = valorAnterior;
    const val2 = expressao;
    const exp = val1 + operadorAtual + val2;
    const res = eval(exp);
    historicoLista.push(`${exp} = ${res}`);
    expressao = res.toString().slice(0, LIMITE_DIGITOS);
    caixaDtexto.value = expressao;
    valorAnterior = null;
    operadorAtual = null;
    novoNumero = false;
    porcentagemGuardada = null;
    modoPorcentagem = false;
  } catch {
    caixaDtexto.value = "Erro";
    expressao = "";
    valorAnterior = null;
    operadorAtual = null;
    novoNumero = false;
    porcentagemGuardada = null;
    modoPorcentagem = false;
  }
}

// TECLADO: atalhos para tudo
document.addEventListener('keydown', function(event) {
  const tecla = event.key;

  if (!isNaN(tecla)) {
    adicionar(tecla);
  } else if (tecla === "+") soma();
  else if (tecla === "-") subtracao();
  else if (tecla === "*" || tecla === "x") multiplicacao();
  else if (tecla === "/") divisão();
  else if (tecla === "Enter") resultado();
  else if (tecla === "Backspace") apagar();
  else if (tecla === ".") ponto();
  else if (tecla === "%") porcentagem();
  else if (tecla === "(" || tecla === ")") colchetes();
  else if (tecla === "c" || tecla === "C") C();
  else if (tecla === "h" || tecla === "H") historico();
  else if (tecla === "s" || tecla === "S") trocaSinal(); 
});
