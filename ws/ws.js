// Importing the required modules
const WebSocketServer = require('ws');

const meta = [
  { country: 'Afghanistan', continent: 3, lexp_time: 'panels/lexp_time/Afghanistan_Asia.svg' },
  { country: 'Albania', continent: 4, lexp_time: 'panels/lexp_time/Albania_Europe.svg' },
  { country: 'Algeria', continent: 1, lexp_time: 'panels/lexp_time/Algeria_Africa.svg' },
  { country: 'Angola', continent: 1, lexp_time: 'panels/lexp_time/Angola_Africa.svg' },
  { country: 'Argentina', continent: 2, lexp_time: 'panels/lexp_time/Argentina_Americas.svg' },
  { country: 'Australia', continent: 5, lexp_time: 'panels/lexp_time/Australia_Oceania.svg' },
  { country: 'Austria', continent: 4, lexp_time: 'panels/lexp_time/Austria_Europe.svg' },
  { country: 'Bahrain', continent: 3, lexp_time: 'panels/lexp_time/Bahrain_Asia.svg' },
  { country: 'Bangladesh', continent: 3, lexp_time: 'panels/lexp_time/Bangladesh_Asia.svg' },
  { country: 'Belgium', continent: 4, lexp_time: 'panels/lexp_time/Belgium_Europe.svg' },
  { country: 'Benin', continent: 1, lexp_time: 'panels/lexp_time/Benin_Africa.svg' },
  { country: 'Bosnia and Herzegovina', continent: 4, lexp_time: 'panels/lexp_time/Bosnia_and_Herzegovina_Europe.svg' },
  { country: 'Botswana', continent: 1, lexp_time: 'panels/lexp_time/Botswana_Africa.svg' },
  { country: 'Brazil', continent: 2, lexp_time: 'panels/lexp_time/Brazil_Americas.svg' },
  { country: 'Bulgaria', continent: 4, lexp_time: 'panels/lexp_time/Bulgaria_Europe.svg' },
  { country: 'Burkina Faso', continent: 1, lexp_time: 'panels/lexp_time/Burkina_Faso_Africa.svg' },
  { country: 'Burundi', continent: 1, lexp_time: 'panels/lexp_time/Burundi_Africa.svg' },
  { country: 'Cambodia', continent: 3, lexp_time: 'panels/lexp_time/Cambodia_Asia.svg' },
  { country: 'Cameroon', continent: 1, lexp_time: 'panels/lexp_time/Cameroon_Africa.svg' },
  { country: 'Canada', continent: 2, lexp_time: 'panels/lexp_time/Canada_Americas.svg' },
  { country: 'Central African Republic', continent: 1, lexp_time: 'panels/lexp_time/Central_African_Republic_Africa.svg' },
  { country: 'Chad', continent: 1, lexp_time: 'panels/lexp_time/Chad_Africa.svg' },
  { country: 'Chile', continent: 2, lexp_time: 'panels/lexp_time/Chile_Americas.svg' },
  { country: 'China', continent: 3, lexp_time: 'panels/lexp_time/China_Asia.svg' },
  { country: 'Colombia', continent: 2, lexp_time: 'panels/lexp_time/Colombia_Americas.svg' },
  { country: 'Comoros', continent: 1, lexp_time: 'panels/lexp_time/Comoros_Africa.svg' },
  { country: 'Costa Rica', continent: 2, lexp_time: 'panels/lexp_time/Costa_Rica_Americas.svg' },
  { country: 'Croatia', continent: 4, lexp_time: 'panels/lexp_time/Croatia_Europe.svg' },
  { country: 'Cuba', continent: 2, lexp_time: 'panels/lexp_time/Cuba_Americas.svg' },
  { country: 'Denmark', continent: 4, lexp_time: 'panels/lexp_time/Denmark_Europe.svg' },
  { country: 'Djibouti', continent: 1, lexp_time: 'panels/lexp_time/Djibouti_Africa.svg' },
  { country: 'Dominican Republic', continent: 2, lexp_time: 'panels/lexp_time/Dominican_Republic_Americas.svg' },
  { country: 'Ecuador', continent: 2, lexp_time: 'panels/lexp_time/Ecuador_Americas.svg' },
  { country: 'Egypt', continent: 1, lexp_time: 'panels/lexp_time/Egypt_Africa.svg' },
  { country: 'El Salvador', continent: 2, lexp_time: 'panels/lexp_time/El_Salvador_Americas.svg' },
  { country: 'Equatorial Guinea', continent: 1, lexp_time: 'panels/lexp_time/Equatorial_Guinea_Africa.svg' },
  { country: 'Eritrea', continent: 1, lexp_time: 'panels/lexp_time/Eritrea_Africa.svg' },
  { country: 'Ethiopia', continent: 1, lexp_time: 'panels/lexp_time/Ethiopia_Africa.svg' },
  { country: 'Finland', continent: 4, lexp_time: 'panels/lexp_time/Finland_Europe.svg' },
  { country: 'France', continent: 4, lexp_time: 'panels/lexp_time/France_Europe.svg' },
  { country: 'Gabon', continent: 1, lexp_time: 'panels/lexp_time/Gabon_Africa.svg' },
  { country: 'Gambia', continent: 1, lexp_time: 'panels/lexp_time/Gambia_Africa.svg' },
  { country: 'Germany', continent: 4, lexp_time: 'panels/lexp_time/Germany_Europe.svg' },
  { country: 'Ghana', continent: 1, lexp_time: 'panels/lexp_time/Ghana_Africa.svg' },
  { country: 'Greece', continent: 4, lexp_time: 'panels/lexp_time/Greece_Europe.svg' },
  { country: 'Guatemala', continent: 2, lexp_time: 'panels/lexp_time/Guatemala_Americas.svg' },
  { country: 'Guinea', continent: 1, lexp_time: 'panels/lexp_time/Guinea_Africa.svg' },
  { country: 'Guinea-Bissau', continent: 1, lexp_time: 'panels/lexp_time/Guinea_Bissau_Africa.svg' },
  { country: 'Haiti', continent: 2, lexp_time: 'panels/lexp_time/Haiti_Americas.svg' },
  { country: 'Honduras', continent: 2, lexp_time: 'panels/lexp_time/Honduras_Americas.svg' },
  { country: 'Hungary', continent: 4, lexp_time: 'panels/lexp_time/Hungary_Europe.svg' },
  { country: 'Iceland', continent: 4, lexp_time: 'panels/lexp_time/Iceland_Europe.svg' },
  { country: 'India', continent: 3, lexp_time: 'panels/lexp_time/India_Asia.svg' },
  { country: 'Indonesia', continent: 3, lexp_time: 'panels/lexp_time/Indonesia_Asia.svg' },
  { country: 'Iraq', continent: 3, lexp_time: 'panels/lexp_time/Iraq_Asia.svg' },
  { country: 'Ireland', continent: 4, lexp_time: 'panels/lexp_time/Ireland_Europe.svg' },
  { country: 'Israel', continent: 3, lexp_time: 'panels/lexp_time/Israel_Asia.svg' },
  { country: 'Italy', continent: 4, lexp_time: 'panels/lexp_time/Italy_Europe.svg' },
  { country: 'Jamaica', continent: 2, lexp_time: 'panels/lexp_time/Jamaica_Americas.svg' },
  { country: 'Japan', continent: 3, lexp_time: 'panels/lexp_time/Japan_Asia.svg' },
  { country: 'Jordan', continent: 3, lexp_time: 'panels/lexp_time/Jordan_Asia.svg' },
  { country: 'Kenya', continent: 1, lexp_time: 'panels/lexp_time/Kenya_Africa.svg' },
  { country: 'Kuwait', continent: 3, lexp_time: 'panels/lexp_time/Kuwait_Asia.svg' },
  { country: 'Lebanon', continent: 3, lexp_time: 'panels/lexp_time/Lebanon_Asia.svg' },
  { country: 'Lesotho', continent: 1, lexp_time: 'panels/lexp_time/Lesotho_Africa.svg' },
  { country: 'Liberia', continent: 1, lexp_time: 'panels/lexp_time/Liberia_Africa.svg' },
  { country: 'Libya', continent: 1, lexp_time: 'panels/lexp_time/Libya_Africa.svg' },
  { country: 'Madagascar', continent: 1, lexp_time: 'panels/lexp_time/Madagascar_Africa.svg' },
  { country: 'Malawi', continent: 1, lexp_time: 'panels/lexp_time/Malawi_Africa.svg' },
  { country: 'Malaysia', continent: 3, lexp_time: 'panels/lexp_time/Malaysia_Asia.svg' },
  { country: 'Mali', continent: 1, lexp_time: 'panels/lexp_time/Mali_Africa.svg' },
  { country: 'Mauritania', continent: 1, lexp_time: 'panels/lexp_time/Mauritania_Africa.svg' },
  { country: 'Mauritius', continent: 1, lexp_time: 'panels/lexp_time/Mauritius_Africa.svg' },
  { country: 'Mexico', continent: 2, lexp_time: 'panels/lexp_time/Mexico_Americas.svg' },
  { country: 'Mongolia', continent: 3, lexp_time: 'panels/lexp_time/Mongolia_Asia.svg' },
  { country: 'Montenegro', continent: 4, lexp_time: 'panels/lexp_time/Montenegro_Europe.svg' },
  { country: 'Morocco', continent: 1, lexp_time: 'panels/lexp_time/Morocco_Africa.svg' },
  { country: 'Mozambique', continent: 1, lexp_time: 'panels/lexp_time/Mozambique_Africa.svg' },
  { country: 'Myanmar', continent: 3, lexp_time: 'panels/lexp_time/Myanmar_Asia.svg' },
  { country: 'Namibia', continent: 1, lexp_time: 'panels/lexp_time/Namibia_Africa.svg' },
  { country: 'Nepal', continent: 3, lexp_time: 'panels/lexp_time/Nepal_Asia.svg' },
  { country: 'Netherlands', continent: 4, lexp_time: 'panels/lexp_time/Netherlands_Europe.svg' },
  { country: 'New Zealand', continent: 5, lexp_time: 'panels/lexp_time/New_Zealand_Oceania.svg' },
  { country: 'Nicaragua', continent: 2, lexp_time: 'panels/lexp_time/Nicaragua_Americas.svg' },
  { country: 'Niger', continent: 1, lexp_time: 'panels/lexp_time/Niger_Africa.svg' },
  { country: 'Nigeria', continent: 1, lexp_time: 'panels/lexp_time/Nigeria_Africa.svg' },
  { country: 'Norway', continent: 4, lexp_time: 'panels/lexp_time/Norway_Europe.svg' },
  { country: 'Oman', continent: 3, lexp_time: 'panels/lexp_time/Oman_Asia.svg' },
  { country: 'Pakistan', continent: 3, lexp_time: 'panels/lexp_time/Pakistan_Asia.svg' },
  { country: 'Panama', continent: 2, lexp_time: 'panels/lexp_time/Panama_Americas.svg' },
  { country: 'Paraguay', continent: 2, lexp_time: 'panels/lexp_time/Paraguay_Americas.svg' },
  { country: 'Peru', continent: 2, lexp_time: 'panels/lexp_time/Peru_Americas.svg' },
  { country: 'Philippines', continent: 3, lexp_time: 'panels/lexp_time/Philippines_Asia.svg' },
  { country: 'Poland', continent: 4, lexp_time: 'panels/lexp_time/Poland_Europe.svg' },
  { country: 'Portugal', continent: 4, lexp_time: 'panels/lexp_time/Portugal_Europe.svg' },
  { country: 'Puerto Rico', continent: 2, lexp_time: 'panels/lexp_time/Puerto_Rico_Americas.svg' },
  { country: 'Romania', continent: 4, lexp_time: 'panels/lexp_time/Romania_Europe.svg' },
  { country: 'Rwanda', continent: 1, lexp_time: 'panels/lexp_time/Rwanda_Africa.svg' },
  { country: 'Sao Tome and Principe', continent: 1, lexp_time: 'panels/lexp_time/Sao_Tome_and_Principe_Africa.svg' },
  { country: 'Saudi Arabia', continent: 3, lexp_time: 'panels/lexp_time/Saudi_Arabia_Asia.svg' },
  { country: 'Senegal', continent: 1, lexp_time: 'panels/lexp_time/Senegal_Africa.svg' },
  { country: 'Serbia', continent: 4, lexp_time: 'panels/lexp_time/Serbia_Europe.svg' },
  { country: 'Sierra Leone', continent: 1, lexp_time: 'panels/lexp_time/Sierra_Leone_Africa.svg' },
  { country: 'Singapore', continent: 3, lexp_time: 'panels/lexp_time/Singapore_Asia.svg' },
  { country: 'Slovenia', continent: 4, lexp_time: 'panels/lexp_time/Slovenia_Europe.svg' },
  { country: 'Somalia', continent: 1, lexp_time: 'panels/lexp_time/Somalia_Africa.svg' },
  { country: 'South Africa', continent: 1, lexp_time: 'panels/lexp_time/South_Africa_Africa.svg' },
  { country: 'Spain', continent: 4, lexp_time: 'panels/lexp_time/Spain_Europe.svg' },
  { country: 'Sri Lanka', continent: 3, lexp_time: 'panels/lexp_time/Sri_Lanka_Asia.svg' },
  { country: 'Sudan', continent: 1, lexp_time: 'panels/lexp_time/Sudan_Africa.svg' },
  { country: 'Swaziland', continent: 1, lexp_time: 'panels/lexp_time/Swaziland_Africa.svg' },
  { country: 'Sweden', continent: 4, lexp_time: 'panels/lexp_time/Sweden_Europe.svg' },
  { country: 'Switzerland', continent: 4, lexp_time: 'panels/lexp_time/Switzerland_Europe.svg' },
  { country: 'Thailand', continent: 3, lexp_time: 'panels/lexp_time/Thailand_Asia.svg' },
  { country: 'Togo', continent: 1, lexp_time: 'panels/lexp_time/Togo_Africa.svg' },
  { country: 'Trinidad and Tobago', continent: 2, lexp_time: 'panels/lexp_time/Trinidad_and_Tobago_Americas.svg' },
  { country: 'Tunisia', continent: 1, lexp_time: 'panels/lexp_time/Tunisia_Africa.svg' },
  { country: 'Turkey', continent: 4, lexp_time: 'panels/lexp_time/Turkey_Europe.svg' },
  { country: 'Uganda', continent: 1, lexp_time: 'panels/lexp_time/Uganda_Africa.svg' },
  { country: 'United Kingdom', continent: 4, lexp_time: 'panels/lexp_time/United_Kingdom_Europe.svg' },
  { country: 'Uruguay', continent: 2, lexp_time: 'panels/lexp_time/Uruguay_Americas.svg' },
  { country: 'Zambia', continent: 1, lexp_time: 'panels/lexp_time/Zambia_Africa.svg' },
  { country: 'Zimbabwe', continent: 1, lexp_time: 'panels/lexp_time/Zimbabwe_Africa.svg' },
];

// Creating a new websocket server
const wss = new WebSocketServer.Server({ port: 8080 });

// Creating connection using websocket
wss.on('connection', (ws) => {
  console.log('new client connected');

  // sending message to client
  // ws.send('Welcome, you are connected!');

  // on message from client
  ws.on('message', (data) => {
    console.log(`Client has sent us: ${data}`);
    const data2 = JSON.parse(data);
    const datum = meta.filter((d) => d[data2.panelName] === data2.panelURL)[0];
    console.log(datum.country);
    ws.send(JSON.stringify({ country: datum.country }));
  });

  // handling what to do when clients disconnects from server
  ws.on('close', () => {
    console.log('the client has connected');
  });
  // handling client connection error
  ws.onerror = function () {
    console.log('Some Error occurred');
  };
});
console.log('The WebSocket server is running on port 8080');

// node ws.js runs the server
