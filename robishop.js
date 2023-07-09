const axios = require('axios');

let loginData = JSON.stringify({
    "username": "mumtahina",
    "password": "test123"
  });

const login = async(loginData) => {
      
      let loginConfig = {
        method: 'post',
        maxBodyLength: Infinity,
        url: 'https://cdn.robishop.com.bd/rest/V1/integration/admin/token',
        headers: { 
          'Content-Type': 'application/json', 
          'Cookie': 'BIGipServerpool_sandbox_robishop_com_bd=!gbe8SkKmFVJxvNX38fqIr7/bpSqP863lstVI86YRF0hYze97s1OQVOGcTuaT/McpZwGmrvRWMLfpylE=; PHPSESSID=3ffbb2f06b2fe8e992fdf120ee041487'
        },
        data : loginData
      };
      
      let token;
      
      await axios.request(loginConfig)
      .then((response) => {
        console.log(JSON.stringify(response.data));
        token = response.data;
      })
      .catch((error) => {
        console.log(error);
      });

      return token;
}

const authorize = async() => {

    let token = await login(loginData);

    let data = JSON.stringify({
        "orderIds": [
          "RS000054644",
          "RS000054648",
          "RS000055254"
        ]
      });
      
      let config = {
        method: 'post',
        maxBodyLength: Infinity,
        url: 'https://cdn.robishop.com.bd/rest/V1/orders/status',
        headers: { 
          'Authorization': `Bearer ${token}`, 
          'Content-Type': 'application/json'
          },
        data : data
      };
      
      axios.request(config)
      .then((response) => {
        console.log(JSON.stringify(response.data));
      })
      .catch((error) => {
        console.log(error);
      });
      

}

authorize();

