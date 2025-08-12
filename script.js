let despesas = JSON.parse(localStorage.getItem("Despesas")) || [];
let editIndex = null;

function salvar() {
    localStorage.setItem("Despesas", JSON.stringify(despesas));
}

function atualizar(lista = despesas) {
    const tbody = document.getElementById("lista");
    tbody.innerHTML = "";
    let total = 0;

    lista.forEach((despesa, index) => {
        const valorNum = parseFloat(despesa.valor);
        total += isNaN(valorNum) ? 0 : valorNum;

        let classeValor = "";
        let tooltipValor = "";

        if (isNaN(valorNum) || valorNum === 0) {
            classeValor = "sub-branco";
            tooltipValor = "Você precisa abrir o bolso kkkk🤣";
        } else if (valorNum < 100) {
            classeValor = "sub-verde";
            tooltipValor = "Continue gastando conscientemente.";
        }

        tbody.innerHTML += `
            <tr>
                <td>${despesa.descricao}</td> 
                <td class="${classeValor}" data-tooltip="${tooltipValor}">
                    R$ ${isNaN(valorNum) ? "0.00" : valorNum.toFixed(2)}
                </td>
                <td>${despesa.data}</td>
                <td>${despesa.categoria || ""}</td>
                <td>
                    <button onclick="editarDespesa(${index})">Editar</button>
                    <button onclick="removerDespesa(${index})">Excluir</button>
                </td>
            </tr>
        `;
    });

    let classeTotal = "";
    let tooltipTotal = "";

    if (total === 0) {
        classeTotal = "sub-branco";
        tooltipTotal = "Você precisa abrir o bolso kkkk🤣";
    } else if (total >= 99 && total <= 2000) {
        classeTotal = "sub-amarelo";
        tooltipTotal = "Fique em alerta com seus gastos no final do mês.";
    } else if (total > 2000) {
        classeTotal = "sub-vermelho";
        tooltipTotal = "Você pode se endividar...";
    }

    document.getElementById("total").innerHTML = `
        <span class="${classeTotal}" data-tooltip="${tooltipTotal}">
            TOTAL R$: ${total.toFixed(2)}
        </span>
    `;
}

function adicionar() {
    const descricao = document.getElementById("descricao");
    const valor = document.getElementById("valor");
    const data = document.getElementById("data");
    const categoria = document.getElementById("categoria");

    const valorNum = parseFloat(valor.value);

    if (!descricao.value.trim() || !valor.value.trim() || !data.value || isNaN(valorNum) || valorNum < 0.01) {
        [descricao, valor, data].forEach(input => {
            if (!input.value.trim() || (input === valor && (isNaN(valorNum) || valorNum < 0.01))) {
                input.classList.add("shake");
                setTimeout(() => input.classList.remove("shake"), 500);
            }
        });
        alert("Digite um valor válido (maior ou igual a 0,01).");
        return;
    }

    if (editIndex !== null) {
        despesas[editIndex] = {
            descricao: descricao.value,
            valor: valor.value,
            data: data.value,
            categoria: categoria.value
        };
        editIndex = null;
        document.getElementById("btnAdicionar").innerText = "Adicionar";
    } else {
        despesas.push({
            descricao: descricao.value,
            valor: valor.value,
            data: data.value,
            categoria: categoria.value
        });
    }

    salvar();
    atualizar();
    descricao.value = "";
    valor.value = "";
    data.value = "";
    categoria.value = "";
}

function editarDespesa(index) {
    const despesa = despesas[index];
    document.getElementById("descricao").value = despesa.descricao;
    document.getElementById("valor").value = despesa.valor;
    document.getElementById("data").value = despesa.data;
    document.getElementById("categoria").value = despesa.categoria || "";
    editIndex = index;
    document.getElementById("btnAdicionar").innerText = "Salvar Alteração";
}

function removerDespesa(index) {
    if (confirm("Deseja realmente excluir esta despesa?")) {
        despesas.splice(index, 1);
        salvar();
        atualizar();
    }
}

function limparTudo() {
    if (confirm("Tem certeza que deseja limpar todas as despesas?")) {
        despesas = [];
        salvar();
        atualizar();
    }
}

function filtrarPorData() {
    const mesSelecionado = document.getElementById("filtroData").value;
    if (!mesSelecionado) {
        atualizar();
        return;
    }
    const filtradas = despesas.filter(d => d.data.startsWith(mesSelecionado));
    atualizar(filtradas);
}

function limparFiltro() {
    document.getElementById("filtroData").value = "";
    atualizar();
}

atualizar();

// Criar .txt organizado
document.getElementById("btnExportar").addEventListener("click", () => {
    if (despesas.length === 0) {
        alert("Nenhuma despesa registrada para exportar.");
        return;
    }

    let conteudo = "=== CONTROLE DE DESPESAS ===\n\n";
    let total = 0;

    despesas.forEach((despesa, i) => {
        conteudo += `${i + 1}. Descrição: ${despesa.descricao}\n`;
        conteudo += `   Valor: R$ ${parseFloat(despesa.valor).toFixed(2)}\n`;
        conteudo += `   Data: ${despesa.data}\n\n`;
        total += parseFloat(despesa.valor);
    });

    conteudo += "--------------------------\n";
    conteudo += `TOTAL GASTO: R$ ${total.toFixed(2)}\n`;

    const blob = new Blob([conteudo], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.download = "despesas.txt";
    link.click();

    URL.revokeObjectURL(url);
});