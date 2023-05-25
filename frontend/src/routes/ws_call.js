const responseInit = async (url, method, authorization, body, contentType = "application/json") => {
  const content = {
    method: method,
    headers: {
      "Content-Type": contentType,
      Authorization: "",
    },
    body: body !== undefined ? body : undefined,
  };

  if (authorization !== undefined && authorization !== null) {
    content.headers.Authorization = authorization;
  }

  // console.log(content);

  // console.log(url);
  const response = await fetch(url, content);

  return response;
};

export const fetchData = async (url, method, authorization, body) => {
  const response = await responseInit(url, method, authorization, body);

  console.log(response);

  if (response.status === 400) {
    throw new Error("Error");
  }

  const data = await response.json();

  if (data.error) {
    throw new Error(data.message);
  }

  return data.data;
};

// export const getArticles = async () => {
//   const response = await responseInit("http://localhost:8080/articles", "GET");

//   if (response.status === 400) {
//     throw new Error("Error");
//   }

//   const data = await response.json();

//   if ("error" in data) {
//     throw new Error(data.error.message);
//   }

//   return data.data;
// };

// export const getCategories = async () => {
//   const response = await responseInit("http://localhost:8080/categories", "GET");

//   if (response.status === 400) {
//     throw new Error("Error");
//   }

//   const data = await response.json();

//   if ("error" in data) {
//     throw new Error(data.error.message);
//   }

//   return data.data;
// };

// export const getArticle = async (param) => {
//   const params = param.slug.split("-");
//   const id = params[params.length - 1];

//   const response = await responseInit("http://localhost:8080/articles/" + id, "GET", null);

//   if (response.status === 400) {
//     throw new Error("Error");
//   }

//   const data = await response.json();

//   if ("error" in data) {
//     throw new Error(data.error.message);
//   }

//   return data.data;
// };

// export const saveArticle = async (title, summary, category, content) => {
//   var dataToSend = JSON.stringify({
//     title: title,
//     summary: summary,
//     category: { id: category },
//     content: content,
//   });
//   // dataToSend = JSON.parse(dataToSend);

//   const response = await responseInit("http://localhost:8080/articles", "POST", null, dataToSend);

//   if (response.status === 400) {
//     throw new Error("Failed Saving article");
//   }

//   const data = await response.json();

//   if ("error" in data) {
//     throw new Error(data.error.message);
//   }

//   return data.data;
// };

export const signIn = async (email, pwd) => {
  var dataToSend = JSON.stringify({
    email: email,
    passwd: pwd,
  });
  // dataToSend = JSON.parse(dataToSend);

  const response = await responseInit(
    "http://localhost:8080/employees/signin",
    "POST",
    null,
    dataToSend
  );

  const data = await response.json();

  if (data.error) {
    throw new Error(data.message);
  }

  return data.data;
};

export const signOut = async () => {
  const response = await responseInit(
    "http://localhost:8080/employees/signout",
    "DELETE",
    null,
    null
  );

  sessionStorage.removeItem("user");

  const data = await response.json();

  if (data.error) {
    throw new Error(data.message);
  }
  window.location.href = "/signin";

  return data.message;
};

export const getBrands = async () => {
  const response = await responseInit("http://localhost:8080/brands", "GET", null);

  const data = await response.json();

  if (data.error in data) {
    throw new Error(data.message);
  }

  return data.data.content;
};

export const getCpus = async () => {
  const response = await responseInit("http://localhost:8080/cpus", "GET", null);

  const data = await response.json();

  if (data.error in data) {
    throw new Error(data.message);
  }

  return data.data.content;
};

export const getLocations = async () => {
  const response = await responseInit("http://localhost:8080/locations", "GET", null);

  const data = await response.json();

  if (data.error in data) {
    throw new Error(data.message);
  }

  return data.data.content;
};

export const getModelsByBrand = async (brand_id) => {
  var dataToSend = JSON.stringify({
    brand: { id: brand_id ? brand_id : -5 },
  });

  const response = await responseInit(
    "http://localhost:8080/models/search",
    "POST",
    null,
    dataToSend
  );

  const data = await response.json();

  if (data.error in data) {
    throw new Error(data.message);
  }

  return data.data.content;
};

export const getLaptopsByBrand = async (brand_id) => {
  var dataToSend = JSON.stringify({
    brand: { id: brand_id ? brand_id : -5 },
  });

  const response = await responseInit(
    "http://localhost:8080/laptop_model/search",
    "POST",
    null,
    dataToSend
  );

  const data = await response.json();

  if (data.error in data) {
    throw new Error(data.message);
  }

  return data.data.content;
};

export const saveLaptop = async (prix, model_id) => {
  var dataToSend = JSON.stringify({
    model: { id: model_id },
    sales_price: prix,
  });

  const response = await responseInit("http://localhost:8080/laptops", "POST", null, dataToSend);

  const data = await response.json();

  if (data.error in data) {
    throw new Error(data.message);
  }

  if (response.status === 500) {
    throw new Error("Modèle déja existant");
  }

  return data.data.content;
};

export const saveSalespoint = async (location_id, name) => {
  var dataToSend = JSON.stringify({
    location: { id: location_id },
    store_name: name,
    category: { id: 2 },
  });

  const response = await responseInit("http://localhost:8080/stores", "POST", null, dataToSend);

  const data = await response.json();

  if (data.error in data) {
    throw new Error(data.message);
  }

  if (response.status === 500) {
    throw new Error("Veuiller choisir un autre nom");
  }

  return data.data.content;
};

export const updateLaptop = async (id, prix, model_id) => {
  var dataToSend = JSON.stringify({
    model: { id: model_id },
    sales_price: prix,
  });

  const response = await responseInit(
    `http://localhost:8080/laptops/${id}`,
    "PUT",
    null,
    dataToSend
  );

  const data = await response.json();

  if (data.error in data) {
    throw new Error(data.message);
  }

  if (response.status === 500) {
    throw new Error("Modèle déja existant");
  }

  return data.data.content;
};

export const searchLaptop = async (q) => {
  const response = await responseInit(
    `http://localhost:8080/laptops/search?q=${q ? q : ""}`,
    "GET",
    null
  );

  const data = await response.json();

  if (data.error in data) {
    throw new Error(data.message);
  }

  return data.data.content;
};

export const searchEmployees = async (q) => {
  const response = await responseInit(
    `http://localhost:8080/employees/search?q=${q ? q : ""}`,
    "GET",
    null
  );

  const data = await response.json();

  if (data.error in data) {
    throw new Error(data.message);
  }

  return data.data.content;
};

export const affectEmployee = async (id, store_id) => {
  var dataToSend = JSON.stringify({
    store: { id: store_id },
  });

  const response = await responseInit(
    `http://localhost:8080/employees/${id}/affect`,
    "PUT",
    null,
    dataToSend
  );

  const data = await response.json();

  if (data.error in data) {
    throw new Error(data.message);
  }

  return data.data.content;
};

export const getSalesPoint = async () => {
  const response = await responseInit(`http://localhost:8080/stores/isSalesPoint`, "GET", null);

  const data = await response.json();

  if (data.error in data) {
    throw new Error(data.message);
  }

  return data.data.content;
};

export const purchaseLaptop = async (date, laptop_id, qtt, prix) => {
  const user = JSON.parse(sessionStorage.getItem("user"));
  var dataToSend = JSON.stringify({
    laptop: { id: laptop_id },
    purchase_date: date,
    qtt: qtt,
    purchase_price: prix,
    employee: { id: user.id },
  });

  const response = await responseInit(
    "http://localhost:8080/laptops/purchase",
    "POST",
    null,
    dataToSend
  );

  const data = await response.json();

  if (data.error in data) {
    throw new Error(data.message);
  }

  return data.data.content;
};

export const purchaseLaptops = async (date, purchaseItems) => {
  const user = JSON.parse(sessionStorage.getItem("user"));
  var dataToSend = JSON.stringify({
    date: date,
    items: purchaseItems,
    employee: user,
  });

  const response = await responseInit(
    "http://localhost:8080/laptops/purchases",
    "POST",
    null,
    dataToSend
  );

  const data = await response.json();

  if (data.error in data) {
    throw new Error(data.message);
  }

  return data.data;
};

export const getStockToTransfer = async (q) => {
  const user = JSON.parse(sessionStorage.getItem("user"));

  const response = await responseInit(
    `http://localhost:8080/stock_transfer/search?store_id=${user.store.id}&q=${q ? q : ""}`,
    "GET",
    null
  );

  const data = await response.json();

  if (data.error in data) {
    throw new Error(data.message);
  }

  return data.data.content;
};

export const searchStocks = async (q) => {
  const user = JSON.parse(sessionStorage.getItem("user"));

  const response = await responseInit(
    `http://localhost:8080/stockstatus/search?store_id=${user.store.id}&q=${q ? q : ""}`,
    "GET",
    null
  );

  const data = await response.json();

  if (data.error in data) {
    throw new Error(data.message);
  }

  return data.data.content;
};

export const filterReception = async () => {
  const user = JSON.parse(sessionStorage.getItem("user"));

  const response = await responseInit(
    `http://localhost:8080/transfers/search?store_id=${user.store.id}`,
    "GET",
    null
  );

  const data = await response.json();

  if (data.error in data) {
    throw new Error(data.message);
  }

  return data.data.content;
};

export const sendLaptops = async (isTransfer, date, store_id, transferItems) => {
  const user = JSON.parse(sessionStorage.getItem("user"));
  var dataToSend = JSON.stringify({
    date: date,
    items: transferItems,
    employee: user,
    store: { id: store_id ? store_id : user.store.id },
    isTransfer: isTransfer,
  });

  // console.log(dataToSend);
  // alert("BREAK");
  const response = await responseInit(
    "http://localhost:8080/stock_transfer/transfer",
    "POST",
    null,
    dataToSend
  );

  const data = await response.json();

  if (data.error in data) {
    throw new Error(data.message);
  }

  return data.data;
};

export const saleLaptops = async (date, transferItems) => {
  const user = JSON.parse(sessionStorage.getItem("user"));
  var dataToSend = JSON.stringify({
    date: date,
    items: transferItems,
    employee: user,
    store: { id: user.store.id },
    isTransfer: false,
  });

  // console.log(dataToSend);
  // alert("BREAK");
  const response = await responseInit(
    "http://localhost:8080/stock_transfer/sold",
    "POST",
    null,
    dataToSend
  );
  const data = await response.json();

  if (data.error in data) {
    throw new Error(data.message);
  }

  return data.data;
};

export const receiveLaptops = async (isTransfer, date, transferItems) => {
  const user = JSON.parse(sessionStorage.getItem("user"));
  var dataToSend = JSON.stringify({
    date: date,
    items: transferItems,
    employee: user,
    store: { id: user.store.id },
    isTransfer: isTransfer,
  });

  // console.log(dataToSend);
  // alert("BREAK");
  const response = await responseInit(
    "http://localhost:8080/stock_transfer/receive",
    "POST",
    null,
    dataToSend
  );

  const data = await response.json();

  if (data.error in data) {
    throw new Error(data.message);
  }

  return data.data;
};

export const searchSalespoint = async (q) => {
  const response = await responseInit(
    `http://localhost:8080/stores/searchsalespoint?q=${q ? q : ""}`,
    "GET",
    null
  );

  const data = await response.json();

  if (data.error in data) {
    throw new Error(data.message);
  }

  return data.data.content;
};

export const updateSalespoint = async (id, location_id, name) => {
  var dataToSend = JSON.stringify({
    location: { id: location_id },
    store_name: name,
    category: { id: 2 },
  });

  const response = await responseInit(
    `http://localhost:8080/stores/${id}`,
    "PUT",
    null,
    dataToSend
  );

  const data = await response.json();

  if (data.error in data) {
    throw new Error(data.message);
  }

  if (response.status === 500) {
    throw new Error("Modèle déja existant");
  }

  return data.data;
};

export const getStats = async (minYear, maxYear, field, url) => {
  const response = await responseInit(
    `http://localhost:8080/stats/${url}-sales?min=${minYear}&max=${maxYear}&field=${field}`,
    "GET",
    null
  );

  const data = await response.json();

  if (data.error in data) {
    throw new Error(data.message);
  }

  return data.data.content;
};

export const getSales = async (model_name, minPrice, maxPrice) => {
  const user = JSON.parse(sessionStorage.getItem("user"));

  const response = await responseInit(
    `http://localhost:8080/sales/store/${user.store.id}?model=${model_name}&min_price=${minPrice}&max_price=${maxPrice}`,
    "GET",
    null
  );

  const data = await response.json();

  if (data.error in data) {
    throw new Error(data.message);
  }

  return data.data.content;
};

export const getModel = async (model_name) => {
  var dataToSend = JSON.stringify({
    model_name: model_name,
  });

  const response = await responseInit(
    "http://localhost:8080/models/search",
    "POST",
    null,
    dataToSend
  );

  const data = await response.json();

  if (data.error in data) {
    throw new Error(data.message);
  }

  return data.data.content;
};

export const getCpu = async (name) => {
  var dataToSend = JSON.stringify({
    cpu_name: name,
  });

  const response = await responseInit(
    "http://localhost:8080/cpus/search",
    "POST",
    null,
    dataToSend
  );

  const data = await response.json();

  if (data.error in data) {
    throw new Error(data.message);
  }

  return data.data.content;
};

export const searchBrands = async (name) => {
  var dataToSend = JSON.stringify({
    brand_name: name,
  });

  const response = await responseInit(
    "http://localhost:8080/brands/search",
    "POST",
    null,
    dataToSend
  );

  const data = await response.json();

  if (data.error in data) {
    throw new Error(data.message);
  }

  return data.data.content;
};

export const saveModel = async (brand_id, name, cpu_id, screen, ram, disk) => {
  var dataToSend = JSON.stringify({
    brand: { id: brand_id },
    model_name: name,
    cpu: { id: cpu_id },
    screen_size: screen,
    ram_size: ram,
    disk_size: disk,
  });

  const response = await responseInit("http://localhost:8080/models", "POST", null, dataToSend);

  const data = await response.json();

  if (data.error in data) {
    throw new Error(data.message);
  }

  if (response.status === 500) {
    throw new Error("Nom du modèle déja existant");
  }

  return data.data.content;
};

export const saveCPU = async (cpu_name) => {
  var dataToSend = JSON.stringify({
    cpu_name: cpu_name,
  });

  const response = await responseInit("http://localhost:8080/cpus", "POST", null, dataToSend);

  const data = await response.json();

  if (data.error in data) {
    throw new Error(data.message);
  }

  if (response.status === 500) {
    throw new Error("processeur déja existant");
  }

  return data.data.content;
};

export const saveBrand = async (brand_name) => {
  var dataToSend = JSON.stringify({
    brand_name: brand_name,
  });

  const response = await responseInit("http://localhost:8080/brands", "POST", null, dataToSend);

  const data = await response.json();

  if (data.error in data) {
    throw new Error(data.message);
  }

  if (response.status === 500) {
    throw new Error("Marque déja existant");
  }

  return data.data.content;
};

export const updateModel = async (id, brand_id, name, cpu_id, screen, ram, disk) => {
  var dataToSend = JSON.stringify({
    brand: { id: brand_id },
    model_name: name,
    cpu: { id: cpu_id },
    screen_size: screen,
    ram_size: ram,
    disk_size: disk,
  });

  const response = await responseInit(
    `http://localhost:8080/models/${id}`,
    "PUT",
    null,
    dataToSend
  );

  const data = await response.json();

  if (data.error in data) {
    throw new Error(data.message);
  }

  if (response.status === 500) {
    throw new Error("Nom du modèle déja existant");
  }

  return data.data.content;
};

export const updateCpus = async (id, name) => {
  var dataToSend = JSON.stringify({
    cpu_name: name,
  });

  const response = await responseInit(`http://localhost:8080/cpus/${id}`, "PUT", null, dataToSend);

  const data = await response.json();

  if (data.error in data) {
    throw new Error(data.message);
  }

  if (response.status === 500) {
    throw new Error("processeur déja existant");
  }

  return data.data;
};

export const updateBrand = async (id, name) => {
  var dataToSend = JSON.stringify({
    brand_name: name,
  });

  const response = await responseInit(
    `http://localhost:8080/brands/${id}`,
    "PUT",
    null,
    dataToSend
  );

  const data = await response.json();

  if (data.error in data) {
    throw new Error(data.message);
  }

  if (response.status === 500) {
    throw new Error("Marque déja existant");
  }

  return data.data;
};

export const getStoreCommissions = async (month, year) => {
  const response = await responseInit(
    `http://localhost:8080/commissions/store-commissions?monthId=${month}&year=${year}`,
    "GET",
    null
  );

  const data = await response.json();

  if (data.error in data) {
    throw new Error(data.message);
  }

  return data.data.content;
};

export const getCommissions = async () => {
  const response = await responseInit(`http://localhost:8080/commissions`, "GET", null);

  const data = await response.json();

  if (data.error in data) {
    throw new Error(data.message);
  }

  return data.data.content;
};

export const getMonths = async () => {
  const response = await responseInit(`http://localhost:8080/months`, "GET", null);

  const data = await response.json();

  if (data.error in data) {
    throw new Error(data.message);
  }

  return data.data.content;
};

export const updateCommission = async (id, min, max, commission) => {
  var dataToSend = JSON.stringify({
    min: min,
    max: max,
    commission: commission,
  });

  const response = await responseInit(
    `http://localhost:8080/commissions/${id}`,
    "PUT",
    null,
    dataToSend
  );

  const data = await response.json();

  if (data.error in data) {
    throw new Error(data.message);
  }

  // if (response.status === 500) {
  //   throw new Error("processeur déja existant");
  // }

  return data.data;
};

export const saveCommissions = async (min, max, commission) => {
  var dataToSend = JSON.stringify({
    min: min,
    max: max,
    commission: commission,
  });

  const response = await responseInit(
    "http://localhost:8080/commissions",
    "POST",
    null,
    dataToSend
  );

  const data = await response.json();

  if (data.error in data) {
    throw new Error(data.message);
  }

  return data.data.content;
};

export const delCommission = async (id) => {
  const response = await responseInit(
    `http://localhost:8080/commissions/${id}`,
    "DELETE",
    null,
    null
  );

  const data = await response.json();

  if (data.error in data) {
    throw new Error(data.message);
  }

  return data;
};
