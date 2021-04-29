
const storeForm = document.getElementById('store-form');
const storeId = document.getElementById('store-id');
const storeAddress = document.getElementById('store-address');
console.log(storeId.value)
// Send POST to API to add store
async function addStore(e) {
  console.log(storeAddress.value)
  e.preventDefault();

  if (storeId.value === '' || storeAddress.value === '') {
    alert('Please fill in fields');
  }

  const sendBody = {
    address: storeAddress.value
  };

  try {
    const res = await fetch('/getCoords', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(sendBody)
    });
    const res1 = await res.json()
    window.localStorage.setItem("longitude",res1.longitude)
    window.localStorage.setItem("latitude",res1.latitude)
    window.localStorage.setItem("bloodgroup",storeId.value)
    if (res.status === 400) {
      throw Error('Store already exists!');
    }
    window.location.href = 'map';
  } catch (err) {
    alert(err);
    return;
  }
}

storeForm.addEventListener('submit', addStore);
