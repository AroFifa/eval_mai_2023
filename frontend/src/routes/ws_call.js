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
