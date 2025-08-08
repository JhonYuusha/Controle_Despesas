let despesas = JSON.parse(localStorage.getItem("Despesas")) || [];
function salvar(){
    localStorage.setItem("Deespesas", JSON.stringify(despesas));
}
function atualizar(){
    const tbody = document.getElementById("Lista");
    tbody.innerHTML = "";
    let total = 0;
    despesas.forEach((despesa, index) => {{}
        total += parseFloat(despesa.valor);

        tbody.innerHTML += `
            <tr>
                <td>${despesa.descricao}</td> 
                <td>R$ ${parseFloat(despesa.valor).toFixed(2)}</td>
                <td>${despesa.data}</td>
                <td><button onclick="removerDespesa(${index})">Excluir</button></td>
            </tr>
        `;
    });
    document.getElementById("total").innerText = `TOTAL R$: ${total.toFixed(2)}`;
}
function adicionar(){
    const descricao = document.getElementById("descricao").value.trim();
    const valor = document.getElementById("valor").value.trim();
    const data = document.getElementById("data").value;

    despesas.push({descricao, valor, data});
    salvar();
    atualizar();

    document.getElementById("descricao").value = "";
    document.getElementById("valor").value = "";
    document.getElementById("data").value = "";
}
atualizar();
