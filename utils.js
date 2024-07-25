export const getCurrentLocation = () => {
  return new Promise((resolve, reject) => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        position => {
          resolve({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          });
        },
        error => {
          reject(error);
        },
      );
    } else {
      reject(new Error('Geolocation is not supported by this browser.'));
    }
  });
};

export const haversineDistance = (coords1, coords2) => {
  const toRad = x => (x * Math.PI) / 180;

  const R = 6371; // Radio de la Tierra en kilómetros
  const dLat = toRad(coords2?.latitude - coords1?.latitude);
  const dLon = toRad(coords2?.longitude - coords1?.longitude);
  const lat1 = toRad(coords1?.latitude);
  const lat2 = toRad(coords2?.latitude);

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.sin(dLon / 2) * Math.sin(dLon / 2) * Math.cos(lat1) * Math.cos(lat2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  const distance = R * c;
  return distance;
};

export const formatDate = date => {
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  const seconds = String(date.getSeconds()).padStart(2, '0');
  return `${day}/${month}/${year} ${hours}:${minutes}:${seconds}`;
};

export const generateUID = () => {
  const caracteres = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let resultado = '';
  for (let i = 0; i < 6; i++) {
    resultado += caracteres.charAt(
      Math.floor(Math.random() * caracteres.length),
    );
  }
  return resultado;
};

export const stateOrders = Object.freeze({
  RECIBIDO: 1,
  PREPARACIÓN: 2,
  TERMINADO: 3,
});

export const getKeyByValue = value => {
  return (
    Object.keys(stateOrders).find(key => stateOrders[key] === value) || null
  );
};

export const typeRole = Object.freeze({
  waiter: 'Camarero',
  admin: 'Administrador',
  chef: 'Cocinero',
  cashier: 'Cajero',
});

export const typeProducts = Object.freeze({
  main: 'Principal',
  starter: 'Entrante',
  pizza: 'Pizza',
  hambur: 'Hamburguesa',
  drink: 'Bebida',
  other: 'Otro',
  menu: 'menú',
});
