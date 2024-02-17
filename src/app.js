document.addEventListener("alpine:init", () => {
  Alpine.data("products", () => ({
    items: [
      {
        id: 1,
        name: "Jamaican - Nganjuk Coffee Beans",
        img: "1.jpg",
        price: 35000,
      },
      {
        id: 2,
        name: "Jamaican - Sundanese Coffee Beans",
        img: "2.jpg",
        price: 30000,
      },
      {
        id: 3,
        name: "Jamaican - Pacitan Coffee Beans",
        img: "3.jpg",
        price: 45000,
      },
      {
        id: 4,
        name: "Jamaican - Balinese Coffee Beans",
        img: "4.jpg",
        price: 75000,
      },
    ],
  }));

  Alpine.store("cart", {
    items: [],
    total: 0,
    quantity: 0,
    add(newItem) {
      //apakah ada barang yang sama di cart
      const cartItem = this.items.find((item) => item.id === newItem.id);
      // jika belum ada / cart kosng
      if (!cartItem) {
        this.items.push({ ...newItem, quantity: 1, total: newItem.price });
        this.quantity++;
        this.total += newItem.price;
      } else {
        this.items = this.items.map((item) => {
          // jika barang berbeda
          if (item.id !== newItem.id) {
            return item;
          } else {
            // jika barang sudah ada, tambah quantity & total
            item.quantity++;
            item.total = item.price * item.quantity;
            this.quantity++;
            this.total += item.price;
            return item;
          }
        });
      }
    },
    remove(id) {
      // get item yang mau di remove
      const cartItem = this.items.find((item) => item.id === id);

      // jika item lebih dari 1
      if (cartItem.quantity > 1) {
        // track 1 1
        this.items = this.items.map((item) => {
          // jika bukan barnag yg diklik
          if (item.id !== id) {
            return item;
          } else {
            item.quantity--;
            item.total = item.price * item.quantity;
            this.quantity--;
            this.total -= item.price;
            return item;
          }
        });
      } else if (cartItem.quantity === 1) {
        // jika brang sisa 1
        this.items = this.items.filter((item) => item.id !== id);
        this.quantity--;
        this.total -= cartItem.price;
      }
    },
  });
});

// // form falidasi
// const checkoutButton = document.querySelector(".checkout-button");
// checkoutButton.disabled = true;

// const form = document.querySelector;

// form vad

// konversi ke idr

const rupiah = (number) => {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(number);
};

// // form validasi

const checkoutButton = document.querySelector(".checkout-button");
checkoutButton.disabled = true;

const form = document.querySelector("#checkoutForm");

form.addEventListener("keyup", function () {
  for (let i = 0; i < form.elements.length; i++) {
    if (form.elements[i].value.length !== 0) {
      checkoutButton.classList.remove("disabled");
      checkoutButton.classList.add("disabled");
    } else {
      return false;
    }
  }

  checkoutButton.disabled = false;
  checkoutButton.classList.remove("disabled");
});

// kirim data ketika tombol di klik
checkoutButton.addEventListener("click", async function (e) {
  e.preventDefault();
  const formData = new FormData(form);
  const data = new URLSearchParams(formData);
  const objData = Object.fromEntries(data);
  // const message = formatMessage(objData);
  // window.open("http://wa.me/6281270185225?text=" + encodeURIComponent(message));

  // minta transaction token pake ajax/ fetch
  try {
    const response = await fetch("php/placeOrder.php", {
      method: "POST",
      body: data,
    });
    const token = await response.text();
    // console.log(token);
    window.snap.pay(token);
  } catch (err) {
    console.log(err.message);
  }
});

// format pesan wa

const formatMessage = (obj) => {
  return `Data Customer
  Nama: ${obj.name}
  Email: ${obj.email}
  No Hp: ${obj.phone}
 Data Pesanan
 ${JSON.parse(obj.items).map(
   (item) => `${item.name} (${item.quantity} x ${rupiah(item.total)}) \n`
 )}
Total: ${rupiah(obj.total)}
Terima Kasih.`;
};
