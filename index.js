import express from "express"
import mysql from "mysql2"
import cors from "cors"
const app = express()

app.use(cors())
app.use(
  cors({
    origin: ["http://localhost:5173", "http://localhost:3000/"],
  })
)

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
//----------------------------------------------
const connection = mysql.createConnection({
  host: "localhost",
  user: "teuz",
  password: "1234",
  database: "reiseletrica",
})
connection.connect((err) => {
  if (err) throw err
  console.log("Conectado!")
})

//----------------------------------------------
//---------POST--------------------------------
//----------------------------------------------

app.post("/servicos", (req, resposta) => {
  const nome = req.body.Nome
  const descricao = req.body.Descrição
  const duracaoEstimada = req.body.DuraçãoEstimada ? req.body.DuraçãoEstimada : 0
  const duracao = req.body.Duração ? req.body.Duração : 0
  const valor = req.body.Valor ? req.body.Valor : 0
  const valorPago = req.body.ValorJáPago ? req.body.ValorJáPago : 0
  const valorAPagar = req.body.ValorAPagar ? req.body.ValorAPagar : 0
  const status = req.body.Status
  const dataTermino = req.body.DataDeTérmino
  const dataInicio = req.body.DataDeInício
  const notaCliente = req.body.NotaDoCliente ? req.body.NotaDoCliente : 0
  connection.query(
    `insert into servicos (NomeDoCliente, descricao, duracaoEstimada, duracao, valor, valorPago, valorAPagar, status, dataTermino, dataInicio, notaCliente)
    values ('${nome}', '${descricao}',${duracaoEstimada},'${duracao}','${valor}',${valorPago},'${valorAPagar}', '${status}','${dataTermino}', '${dataInicio}', '${notaCliente}')`,
    (err, result) => {
      if (err) {
        console.log(err)
      } else {
        console.log("Cliente cadastrado com sucesso")

        resposta.json({ status: true })
      }
    }
  )
})

app.post("/clientes", (req, resposta) => {
  const Nome = req.body.Nome
  const Endereco = req.body.Endereço
  const Telefone = req.body.Telefone
  const Email = req.body.Email
  connection.query(
    `INSERT INTO Clientes (nome, endereco, telefone, email)
  VALUES ('${Nome}', '${Endereco}', '${Telefone}', '${Email}');`,
    (err, result) => {
      if (err) {
        console.log(err)
      } else {
        console.log("Cliente cadastrado com sucesso")
        resposta.json({ status: true })
      }
    }
  )
})

app.post("/DiasTrabalhados", (req, resposta) => {
  console.log("aqui")
  const data = req.body.Data
  const cliente = req.body.cliente
  const quemtrabalhou = req.body.quemtrabalhou
  const periodo = req.body.periodo
  const servico = req.body.servico ? req.body.servico : 0
  const descricao = req.body.descricao
  const mes = req.body.mes ? req.body.mes : null
  connection.query(
    `INSERT INTO DiasTrabalhados (data, cliente, quemTrabalhou , periodo, servicoId, descricao , mes) 
    VALUES ('${data}', '${cliente}', '${quemtrabalhou}','${periodo}', ${servico} , '${descricao}' , '${mes}');`,
    (err, result) => {
      if (err) {
        console.log(err)
      } else {
        console.log("Dia cadastrado com sucesso")
        resposta.json({ status: true })
      }
    }
  )
})
app.post("/delete", (req, resposta) => {
  connection.query(`DELETE from ${req.body.TABELA} WHERE id = ${req.body.ID}`, (err, result) => {
    if (err) {
      console.log(err)
    } else {
      console.log(`Deletado com sucesso o item ${req.body.ID}`)
      resposta.json({ status: true })
    }
  })
})

app.post("/editarservicos", (req, resposta) => {
  const nome = req.body.NomeDoCliente
  const descricao = req.body.descricao
  const duracaoEstimada = req.body.duracaoEstimada ? req.body.duracaoEstimada : 0
  const duracao = req.body.duracao ? req.body.duracao : 0
  const valor = req.body.valor ? req.body.valor : 0
  const valorPago = req.body.valorPago ? req.body.valorPago : 0
  const valorAPagar = req.body.ValorAPagar ? req.body.ValorAPagar : 0
  const status = req.body.status
  const dataTermino = req.body.dataTermino
  const dataInicio = req.body.dataInicio
  const notaCliente = req.body.notaCliente ? req.body.notaCliente : 0
  const id = req.body.id
  connection.query(
    `UPDATE servicos 
  SET 
    NomeDoCliente = '${nome}',
    descricao = '${descricao}',
    duracaoEstimada = '${duracaoEstimada}',
    duracao = '${duracao}',
    valor = '${valor}',
    valorPago = ${valorPago},
    valorAPagar = '${valorAPagar}',
    status = '${status}',
    dataTermino = '${dataTermino}',
    dataInicio = '${dataInicio}',
    notaCliente = '${notaCliente}'
  WHERE id = ${id};`,
    (err, result) => {
      if (err) {
        console.log(err)
      } else {
        resposta.send({ status: true })
        console.log(`Editado com sucesso o item ${id}`)
      }
    }
  )
})

app.post("/editarclientes", (req, resposta) => {
  const nome = req.body.nome
  const endereco = req.body.endereco
  const telefone = req.body.telefone
  const email = req.body.email
  const id = req.body.id
  console.log(nome, endereco, telefone, email, id)
  connection.query(
    `UPDATE clientes
  SET
    nome = '${nome}',
    endereco = '${endereco}',
    telefone = '${telefone}',
    email = '${email}'
  WHERE id = ${id};`,
    (err, result) => {
      if (err) {
        console.log(err)
      } else {
        resposta.send({ status: true })
        console.log(`Editado com sucesso o item ${id}`)
      }
    }
  )
})

app.post("/filtroservicos", (req, res) => {
  let what = req.body.what
  const type = req.body.type == "Menor para Maior" ? "ASC" : "DESC"
  if (what === "Duração") {
    what = "duracao"
  } else if (what == "Nota") {
    what = "NotaCliente"
  } else if (what === "Valor") {
    what = "valor"
  }
  connection.query(`SELECT * FROM servicos ORDER BY ${what} ${type}`, (err, result) => {
    if (err) {
      console.log(err)
    } else {
      console.log("Busca concluída com sucesso")
      res.json(result)
    }
  })
})

app.post("/editarDias", (req, resposta) => {
  const id = req.body.id
  const data = req.body.data
  const quemtrabalhou = req.body.quemTrabalhou
  const periodo = req.body.periodo
  const servicoId = req.body.servicoId ? req.body.servicoId : 0
  const descricao = req.body.descricao
  const cliente = req.body.cliente
  connection.query(
    `UPDATE DiasTrabalhados
  SET
    data = '${data}',
    quemTrabalhou = '${quemtrabalhou}',
    periodo = '${periodo}',
    servicoId = '${servicoId}',
    descricao = '${descricao}',
    cliente = '${cliente}' WHERE id = ${id};`,
    (err, result) => {
      if (err) {
        console.log(err)
      } else {
        resposta.send({ status: true })
        console.log(`Editado com sucesso o item ${id}`)
      }
    }
  )
})

app.post("/fluxodecaixa", (req, resposta) => {
  const data = req.body.data
  const motivo = req.body.motivo
  const valor = req.body.valor ? req.body.valor : 0
  const metodo = req.body.metodo
  const tipo = req.body.tipo
  const deQuem = req.body.deQuem
  const mes = req.body.mes
  const valorrecebido = req.body.valorRecebido != undefined ? req.body.valorRecebido : null
  connection.query(
    `insert into fluxodecaixa (data,motivo,valor,metodo,tipo,deQuem,mes,valor_recebido)
    values ('${data}','${motivo}',${valor},'${metodo}','${tipo}','${deQuem}','${mes}',${valorrecebido})`,
    (err, res) => {
      if (err) {
        console.log(err)
      } else {
        resposta.send({ status: true })
        console.log(`Fluxo adicionado com sucesso`)
      }
    }
  )
})

app.post("/cadastrarprodutos", (req, resposta) => {
  const data = req.body.data
  const nome = req.body.nome
  const descricao = req.body.descricao
  const preco = req.body.preco ? req.body.preco : 0
  const medida = req.body.medida
  const estoque = req.body.estoque
  connection.query(
    `insert into produtos (datadecompra , nome , descricao , precodecompra , medida , estoque)
    values ('${data}','${nome}','${descricao}',${preco},'${medida}','${estoque}');`,
    (err, res) => {
      if (err) {
        console.log(err)
      } else {
        resposta.send({ status: true })
        console.log(`Produto Cadastrado com sucesso`)
      }
    }
  )
})
app.post("/editarfluxo", (req, resposta) => {
  const id = req.body.id
  const data = req.body.data
  const motivo = req.body.motivo
  const valor = req.body.valor ? req.body.valor : 0
  const metodo = req.body.metodo
  const tipo = req.body.tipo
  const deQuem = req.body.deQuem
  const mes = req.body.mes
  const valor_recebido = req.body.valor_recebido != null ? req.body.valor_recebido : null
  connection.query(
    `UPDATE fluxodecaixa
  SET
    data = '${data}',
    motivo = '${motivo}',
    valor = ${valor},
    metodo = '${metodo}',
    tipo = '${tipo}',
    deQuem = '${deQuem}',
    valor_recebido = ${valor_recebido} WHERE id = ${id};`,
    (err, result) => {
      if (err) {
        console.log(err)
      } else {
        resposta.send({ status: true })
        console.log(`Editado com sucesso o item ${id}`)
      }
    }
  )
})
//----------------------------------------------
//---------GET --------------------------------
//----------------------------------------------
app.get("/servicos", (req, res) => {
  connection.query("SELECT * FROM servicos", (err, result) => {
    if (err) {
      console.log(err)
    } else {
      console.log("Busca concluída com sucesso")
      res.json(result)
    }
  })
})

app.get("/DiasTrabalhados", (req, res) => {
  connection.query("SELECT * FROM DiasTrabalhados", (err, result) => {
    if (err) {
      console.log(err)
    } else {
      console.log("Busca concluída com sucesso")
      res.json(result)
    }
  })
})

app.get("/pendentes", (req, res) => {
  connection.query("SELECT * FROM servicos WHERE status = 'Em andamento'", (err, result) => {
    if (err) {
      console.log(err)
    } else {
      console.log("Busca concluída com sucesso")
      res.json(result)
    }
  })
})

app.get("/concluidos", (req, res) => {
  connection.query("SELECT * FROM servicos WHERE status = 'concluído'", (err, result) => {
    if (err) {
      console.log(err)
    } else {
      console.log("Busca concluída com sucesso")
      res.json(result)
    }
  })
})

app.get("/clientes", (req, res) => {
  connection.query("SELECT * FROM clientes ", (err, result) => {
    if (err) {
      console.log(err)
    } else {
      console.log("Busca concluída com sucesso ")
      res.json(result)
    }
  })
})

app.get("/fluxodecaixa", (req, res) => {
  connection.query("select * from fluxodecaixa", (err, result) => {
    if (err) {
      console.log(err)
    } else {
      console.log("Busca concluída com sucesso ")
      res.json(result)
    }
  })
})
//----------------------------------------------
//----------------Início do site---------------------
//----------------------------------------------
app.listen(8082, () => {
  console.log("Server is running")
})
