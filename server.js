const axios = require('axios').default;

const fastify = require('fastify')({
    logger: true
  })
  
const opts = {
schema: {
    response: {
    200: {
        type: 'object',
        properties: {
        price: { type: 'string' }
        }
    }
    }
}
}


fastify.get('/', async (request, reply) => {
    const err = new Error()
    err.statusCode = 404
    err.message = 'Incorrect path. please check https://github.com/AlterNayte/get_crypto_simple'
    throw err
})

fastify.get('/coins/:coin', async (request, reply) => {
    const coin = request.params.coin;
    result = await (await axios.get(`https://api.coingecko.com/api/v3/simple/price?ids=${coin.toLowerCase()}&vs_currencies=usd`)).data

    if (coin && Object.keys(result).length > 0)
    {
        return { price: `${coin.toUpperCase()} is currently $${result[coin].usd}`}
    }
    const err = new Error()
    err.statusCode = 
    err.message = 'No price exists for this request'
    throw err
})

fastify.get('/coins', async (request, reply) => {
    const coin = request.query.coin ? request.query.coin : null;
    result = await (await axios.get(`https://api.coingecko.com/api/v3/coins/list`)).data
    if (result && result.length > 0)
    {
        return result.map((res)=> res.id)
    }
    const err = new Error()
    err.statusCode = 
    err.message = 'Could not retrieve list from external source'
    throw err
})
  

const start = async () => {
    try {
      await fastify.listen(3000,'0.0.0.0')
    } catch (err) {
      fastify.log.error(err)
      process.exit(1)
    }
}

start()