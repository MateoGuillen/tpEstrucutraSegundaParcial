var natural = require('natural');
var tokenizer = new natural.AggressiveTokenizerEs();



var Twit = require('twit')
var T = new Twit({
    consumer_key : "S0AENDlf3pPFqqtMMBGrDYB8z",
    consumer_secret : "t20hmQFuJ0eb6KmWcAAxaSoh3PmwjLjmii0Ttrzz3oGksSXXxv",
    access_token : "1186073449569144832-A3h1HusrVTjjlm29QUCIPXPMqRMN38",
    access_token_secret : "rPLFcHAhxd7cwTdOFuxF3bTNd2Wftw9RvqeUV32Mhiqna",
  //timeout_ms:           60*1000,  // optional HTTP request timeout to apply to all requests.
  //strictSSL:            true,     // optional - requires SSL certificates to be valid.
})

const fs = require('fs').promises;
const { ChartJSNodeCanvas }= require('chartjs-node-canvas');
const width = 1000;   // define width and height of canvas 
const height = 1000;   
const chartCallback = (ChartJS) => {
 //console.log('Creando Histograma')
};
const canvasRenderService = new ChartJSNodeCanvas({width, height, chartCallback});
const createImage = async (datos,tipoGrafico,op,nombreImagen) => {
    nombreImagen = './' + nombreImagen + '.png'
    const configuration = {
        type: tipoGrafico,
        data: datos,
        options: op,
    }
    const buffer = await canvasRenderService.renderToBuffer(configuration);
    await fs.writeFile(nombreImagen, buffer, 'base64');
};

//maximo de tweets 100
//https://developer.twitter.com/en/docs/twitter-api/v1/tweets/search/api-reference/get-search-tweets
palabraBuscada = "qatar"
cantidadTweets =100
fechaDesde = '2021-10-31'
params = {
    q: palabraBuscada,
    count : cantidadTweets,
    lang : 'es',
    until : fechaDesde
}
var conjunto1Tweets = null
var conjunto2Tweets = null
var tweetsDate = []
var tweetsUser = []
var tweetsUsuario = []
var tweets3 = []


function getTweets1(err, data, response) {
    var tweets = []
    var tweetsText = []
    
    var words = []
    tweets = data
    tweets3 = data
    tweets.forEach(tweet => {
        tweetsText.push(tweet.text)
        var date = new Date(tweet.created_at)

        var fecha = date.toLocaleDateString()
        var user = tweet.user.id
        var usuario = tweet.user.screen_name

        tweetsDate.push(fecha)
        tweetsUser.push(user)
        tweetsUsuario.push(usuario)
    });

    tweetsText.forEach(tweetText => {
        var auxWords = []
        var cleanWords = []
        var stopWordES = ["para","PARA","https","tras","este", "fdbedout","como", "Estoy","pero","Rayyan","paraguay"]

        auxWords = tokenizer.tokenize(tweetText)

        auxWords.forEach(auxword => {
            if(auxword.length > 3 && stopWordES.indexOf(auxword) == -1){
                cleanWords.push(auxword)
            }
        });

        words = words.concat(cleanWords)
        conjunto1Tweets =words
    });

    T.get('search/tweets', params , getTweets2)

}

function getTweets2(err, data, response) {
    var tweets = []
    var tweetsText = []
    tweets3 = tweets3.concat(data.statuses)
    var words = []
    tweets = data.statuses

    tweets.forEach(tweet => {
        tweetsText.push(tweet.text)
        var date = new Date(tweet.created_at)

        var fecha = date.toLocaleDateString()
        var user = tweet.user.id
        var usuario = tweet.user.screen_name

        tweetsDate.push(fecha)
        tweetsUser.push(user)
        tweetsUsuario.push(usuario)
    });

    tweetsText.forEach(tweetText => {
        var auxWords = []
        var cleanWords = []
        var stopWordES = ["para","PARA","https","tras","este", "fdbedout","como", "Estoy","pero","Rayyan","paraguay"]

        auxWords = tokenizer.tokenize(tweetText)

        auxWords.forEach(auxword => {
            if(auxword.length > 3 && stopWordES.indexOf(auxword) == -1){
                cleanWords.push(auxword)
            }
        });

        words = words.concat(cleanWords)
        conjunto2Tweets = words
    });

    //console.log(conjunto1Tweets)
    //console.log(conjunto2Tweets)

    const frecuencia2 = conjunto2Tweets.reduce(function (acc, curr) {
        return acc[curr] ? ++acc[curr] : acc[curr] = 1, acc
      }, {});
    
    const frecuencia1 = conjunto1Tweets.reduce(function (acc, curr) {
        return acc[curr] ? ++acc[curr] : acc[curr] = 1, acc
      }, {});

    //console.log(frecuencia1)
    //console.log(frecuencia2)

    const sortable1 = Object.fromEntries(
        Object.entries(frecuencia1).sort(([,a],[,b]) => a-b)
    );

    const sortable2 = Object.fromEntries(
        Object.entries(frecuencia2).sort(([,a],[,b]) => a-b)
    );

    //console.log(sortable1);
    //console.log(sortable2);

    var top10_1 = []
    var top10_2 = []
    const entries = Object.entries(sortable1);
    top = entries.length -1
    i=0
    while( i < 10){
        const element = entries[top];
        top10_1.push(element)   
        top--
        i++
    }

    const entries2 = Object.entries(sortable2);
    top2 = entries2.length -1
    i=0
    while( i < 10){
        const element = entries2[top2];
        top10_2.push(element)
        top2--
        i++
    }

    ejex_1 = []
    ejey_1 = []

    top10_1.forEach(e => {
        ejex_1.push(e[0])
        ejey_1.push(e[1])    
    });

    ejex_2 = []
    ejey_2 = []

    top10_2.forEach(e => {
        ejex_2.push(e[0])
        ejey_2.push(e[1])    
    });
    //console.log(ejex_1)
    //console.log(ejey_1)

    const datos = {
        labels: ejex_1, //etiquetas del eje x (keys)
        datasets: [{
          label: 'Histograma de Palabras', //titulo del grafico
          data: ejey_1, //valores del eje y (values)
          backgroundColor: [ //colores de cada barra del histograma
            'red',
            'blue',
            'green',
            'yellow',
            'red',
            'blue',
            'yellow',
            'red',
            'blue',
            'black'
          ],
          borderColor: [ //borde de cada barra del histograma
            'black',
            'black',
            'black',
            'black',
            'black',
            'black',
            'black',
            'black',
            'black',
            'black'
          ],
          borderWidth: 1 //grosor del borde de la barra
        }]
      };
    
    const opciones = { //histograma
                        plugins: {
                            legend: {
                                position: 'top',
                            },
                            title: {
                                display: true,
                                text: 'Histograma de Palabras'
                            }
                        },
                        scales: {
                            y: {
                                beginAtZero: true
                                }
                            }
    }
    

    //item 1 a)
    console.log("Número de veces en que cada una de las palabras se encuentra en el Conjunto1 de Tweets es: ")
    console.log(sortable1)
    
    //item 1 b)
    //createImage(datos, 'bar', opciones, "histograma1")

    datos.labels = ejex_2
    datos.datasets[0].label = "Histograma de Palabras 2"
    datos.datasets[0].data = ejey_2
    //item 2 a)
    //createImage(datos,'bar',opciones, "histograma2")

    //item 3
    //interseccion de conjuntos

    //item 4
    //union de conjuntos


    
    //console.log(tweetsDate)
    const frecuencia3 = tweetsDate.reduce(function (acc, curr) {
        return acc[curr] ? ++acc[curr] : acc[curr] = 1, acc
      }, {});

      var topItem5 = []
      const entries3 = Object.entries(frecuencia3);
      top3 = entries3.length -1
      for (let index = 0; index < entries3.length; index++){
        const element = entries3[top3];
        topItem5.push(element)
        top3--
      }
  
      ejex_3 = []
      ejey_3 = []
  
      topItem5.forEach(e => {
          ejex_3.push(e[0])
          ejey_3.push(e[1])    
      });

    datos.labels = ejex_3
    datos.datasets[0].label = "Numero de Tweets por Fecha"
    datos.datasets[0].data = ejey_3
    opciones.plugins.title.text = "Grafico del Numero de Tweets por Fecha"
    //item 5
    //createImage(datos,'line',opciones, "tweetsXfecha")

    //console.log(tweetsUser)
    //console.log(tweetsUsuario)


    fechas = []

    const frecuencia4 = tweetsDate.reduce(function (acc, curr) {
        return acc[curr] ? ++acc[curr] : acc[curr] = 1, acc
      }, {});

      var topItem6 = []
      const entries4 = Object.entries(frecuencia4);
      top4 = entries4.length -1
      for (let index = 0; index < entries4.length; index++){
        const element = entries4[top4];
        topItem6.push(element)
        top4--
      }

      //console.log(topItem6)
      topItem6.forEach(fecha => {
          fechas.push(fecha[0])
      });

    usuarios=[]
    usersAux=[]
    count =0
    
    fechas.forEach((fecha) => {

        tweets3.forEach((tweet)=>{
            var date = new Date(tweet.created_at)
            var dateAux = date.toLocaleDateString()
            if ( dateAux == fecha){
                usersAux.push(tweet.user.id)
            }
        })

        usuarios.push(usersAux) 
        usersAux=[]
    })

    j=0
    ejex_4 = fechas
    ejey_4 = []
    fechas.forEach((fecha)=>{
            var users = usuarios[j].reduce(function (acc, curr) {
                return acc[curr] ? ++acc[curr] : acc[curr] = 1, acc
              }, {});

            cantidad = Object.keys(users).length
            ejey_4.push(cantidad) 
            j=j+1

    })

    //console.log(ejex_4)
    //console.log(ejey_4)
    datos.labels = ejex_4
    datos.datasets[0].label = "Numero de Usuarios por Fecha"
    datos.datasets[0].data = ejey_4
    opciones.plugins.title.text = "Grafico del Numero de Usuarios que escribieron Tweets por Fecha"

    //item 6
    //createImage(datos,'line',opciones, "usuarioxfecha")

      
    const frecuencia5 = tweetsUsuario.reduce(function (acc, curr) {
        return acc[curr] ? ++acc[curr] : acc[curr] = 1, acc
      }, {});
      console.log(frecuencia5)
      var topItem6 = []
      const sortable3 = Object.fromEntries(
        Object.entries(frecuencia5).sort(([,a],[,b]) => a-b)
    );
      const entries5 = Object.entries(sortable3);

      top5 = entries5.length -1
       i=0
    while( i < 10){
        const element = entries5[top5];
        topItem6.push(element)   
        top5--
        i++
    }
    console.log(topItem6)
    

      ejex_5 = []
      ejey_5 = []
  
      topItem6.forEach(e => {
          ejex_5.push(e[0])
          ejey_5.push(e[1])    
      });

    datos.labels = ejex_5
    datos.datasets[0].label = "Numero de Tweets por Usuario"
    datos.datasets[0].data = ejey_5
    opciones.plugins.title.text = "Grafico del Numero de Tweets por Usuario"
    //item 7
    //createImage(datos,'line',opciones, "tweetsXusuario")

    //item 8
    //diferencia conjunto1 tweets - conjunto 2 tweets
    //diferencia conjunto2 tweets - conjunto 1 tweets




}

//maximo 200
//https://developer.twitter.com/en/docs/twitter-api/v1/tweets/timelines/api-reference/get-statuses-user_timeline
params2 = {
    user_id: 30054530,
    count : 200
}
T.get('statuses/user_timeline',params2, getTweets1)







