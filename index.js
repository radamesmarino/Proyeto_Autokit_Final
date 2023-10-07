const express = require('express')
const exphbs = require('express-handlebars')
const mysql = require('mysql')

const app = express()



app.use(
    express.urlencoded({
        extended: true
    })
)

app.use(express.json())

app.use(express.urlencoded({ extended: true }));

app.engine('handlebars', exphbs.engine())
app.set('view engine', 'handlebars')

app.use(express.static('public'))

app.get('/', (req, res) =>{
    res.render('formulario')
})

app.get('/cadastro', (req, res) => {
    res.render('formulario'); // Renderiza o formulário de cadastro
});

app.post ('/cadastrar', (req,res)=>{

    const id_codigo = req.body.id_codigo
    const description = req.body.description
    const id_grupo = req.body.id_grupo
    const EAN = req.body.EAN
    const NCM = req.body.NCM
    const id_montadora = req.body.id_montadora
    const img = `/images/${req.body.id_codigo}.jpg`
    const preco_bruto = req.body.preco_bruto

   console.log(`${id_codigo}, ${description}, ${id_grupo}, ${EAN}, ${NCM}, ${id_montadora}, ${img}, ${preco_bruto}`)

    const sql = `INSERT INTO kits (id_codigo, description, id_grupo, EAN, NCM, id_montadora, img, preco_bruto) 
                VALUES ('${id_codigo}', '${description}', '${id_grupo}', '${EAN}', '${NCM}',  '${id_montadora}', '${img}', '${preco_bruto}')`

    conn.query(sql, function(err){
        if(err){
            console.log(err)
            return
        }
        res.redirect('/kits');
    })

})



app.get('/kits', (req, res)=>{
    
    const sql = "SELECT * FROM kits order by data desc"
    conn.query(sql, function(err, data){
        if(err){
            console.log(err)
            return
        }
      
        const kit = data
        const kit10 = kit.slice(0, 5);
        console.log(kit)
        res.render('kits', {kit10})
    })
})

app.get('/montadoras', (req,res)=>{

    const sql = "SELECT *  FROM marcas order by id_Marca asc"

    conn.query(sql, function (err,data){
        if(err){
            console.log(err)
            return
        }
        const montadora = data
        console.log(data)
        console.log(montadora)
        res.render('montadoras', {montadora})
    })

})

//Trazer dados individuais --- consulta modificada
app.get('/kit/:id_codigo', (req, res)=>{

    const id_codigo = req.params.id_codigo

    console.log(req.params.id_codigo)

    const sql = `SELECT * FROM kits WHERE id_codigo = ${id_codigo}`
    conn.query(sql, function(err, data){
        if(err){
            console.log(err)
            return
        }
      
        const kit = data[0]
        res.render('kit', { kit })
        console.log(kit.img)
    })
})

/* Consulta pra preencher formulario pra edição */


app.get('/kit/edit/:id_codigo', (req,res) =>{

    const id_codigo = req.params.id_codigo

    const sql = `SELECT * from kits WHERE id_codigo = ${id_codigo}`

    conn.query(sql, function(err, data){
        if(err){
            console.log(err)
            return
        }
      
        const kit = data[0]
        res.render('editkit', { kit })
    })


})

app.get('/montadoras/edit/:id_Marca', (req,res) =>{

    const id_Marca = req.params.id_Marca

    const sql = `SELECT * from marcas WHERE id_Marca = ${id_Marca}`

    conn.query(sql, function(err, data){
        if(err){
            console.log(err)
            return
        }
      
        const marca = data[0]
        res.render('editmontadora', { marca })
    })


})

const conn = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'autokit',
})


/* POST pra atualizar o kit */
app.post('/kit/update', (req,res) =>{

    const id_codigo = req.body.id_codigo
    const description = req.body.description
    const id_grupo = req.body.id_grupo
    const EAN = req.body.EAN
    const NCM = req.body.NCM
    const id_montadora = req.body.id_montadora
    const img = req.body.img
    const preco_bruto = req.body.preco_bruto

   console.log(`${id_codigo}, ${description}, ${id_grupo}, ${EAN}, ${NCM}, ${id_montadora}, ${img}, ${preco_bruto}`)

    const sql = `UPDATE kits SET description ='${description}', id_grupo ='${id_grupo}', EAN ='${EAN}', NCM ='${NCM}', id_montadora ='${id_montadora}', img ='${img}', preco_bruto ='${preco_bruto}' WHERE id_codigo ='${id_codigo}'`

    conn.query(sql, function(err){
        if(err){
            console.log(err)
            return
        }
        res.redirect('/kits')
    })
})


/* Deletar um registro */

 app.post('/kit/remove/:id_codigo', (req,res) =>{

    const id_codigo = req.params.id_codigo

    console.log(id_codigo)

    const sql = `DELETE FROM kits WHERE id_codigo = ${id_codigo}`

    conn.query(sql, function(err){
        if(err){
            console.log(err)
            return
        }
        res.redirect('/kits')
    })

 })


conn.connect(function(err){
    if(err){
        console.log(err)
    }
    console.log('Conectou com o Banco de dados')
    app.listen(3000)
})


