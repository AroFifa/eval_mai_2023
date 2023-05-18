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

export const saveLaptop = async (model_id) => {
  var dataToSend = JSON.stringify({
    model: { id: model_id },
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

export const updateLaptop = async (id, model_id) => {
  var dataToSend = JSON.stringify({
    model: { id: model_id },
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
