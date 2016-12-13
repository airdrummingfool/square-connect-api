const crypto = require('crypto');
const request = require('request');
const cheerio = require('cheerio');
const API_HOST = 'https://connect.squareup.com';

//V1
//TODO: ALL of timecards
//TODO: ALL of drawer shifts
//TODO: ALL of settlements
//TODO: ALL of refunds
//TODO: ALL of orders
//TODO: ALL of discounts
//TODO: ALL of fees
//TODO: ALL of pages
//TODO: ALL of cells
//TODO: ALL of modifier lists
//TODO: ALL of modifier options

//V2 (register methods)
//TODO: ALL of refund
//TODO: ALL of location
//TODO: ALL of customer card

/* **********************************************************
 *     EXPORTS
 ************************************************************ */
module.exports = SquareConnect;

/**
 * Main Export, instantiates a Square Client
 * @param {String}  locationId                - Square Location ID
 * @param {String}  accessToken               - Access Token per location
 * @param {Boolean} [extendedDebugInfo]       - Extended response info, useful for debugging as Square doesn't always return an explicit error
 */
function SquareConnect(locationId, accessToken, extendedDebugInfo = false) {
 this.locationId = locationId;
 this.accessToken = accessToken;
 this.extendedDebugInfo = extendedDebugInfo;
 return this;
}

/* **********************************************************
 *    PUBLIC METHODS
 ************************************************************ */

// ----------------------------------------------------------
//    Main Instance Methods
// ----------------------------------------------------------
const MERCHANT_ROUTE = '/v1/me';
/**
 * Returns known Square Data for Merchant based on Auth Token
 * @param  {Function} callback <a href="https://docs.connect.squareup.com/api/connect/v1/#get-merchantid">Read More</a>
 */
SquareConnect.prototype.getMerchantProfile = function getMerchantProfile(callback) {
  this.handleRequest(this.constructOpts(MERCHANT_ROUTE), callback);
}

/**
 * Returns a list of all locations for this merchant
 * @param  {Function} callback <a href="https://docs.connect.squareup.com/api/connect/v1/#get-locations">Read More</a>
 */
SquareConnect.prototype.listLocations = function listLocations(callback) {
  this.handleRequest(this.constructOpts(`${MERCHANT_ROUTE}/locations`), callback);
}

// ----------------------------------------------------------
//    Role Methods
// ----------------------------------------------------------
const ROLE_ROUTE = '/v1/me/roles';
/**
 * Returns known Square Roles for Merchant based on Auth Token
 * @param  {Function} callback <a href="https://docs.connect.squareup.com/api/connect/v1/#navsection-roles">Read More</a>
 */
SquareConnect.prototype.listRoles = function listRoles(callback) {
  this.handleRequest(this.constructOpts(ROLE_ROUTE), callback);
}

/**
 * Returns a role, queried by Id
 * @param  {String}   roleId - Id of role to query <a href="https://docs.connect.squareup.com/api/connect/v1/#get-roleid">Read More</a>
 * @param  {Function} callback
 */
SquareConnect.prototype.getRole = function getRole(roleId, callback) {
  this.handleRequest(this.constructOpts(`${ROLE_ROUTE}/${roleId}`), callback);
}

/**
 * Creates a Role
 * @param  {Object}   data     <a href="https://docs.connect.squareup.com/api/connect/v1/#post-roles">PROPERTIES</a>
 * @param  {Function} callback
 */
SquareConnect.prototype.createRole = function createRole(data, callback) {
  this.handleRequest(this.constructOpts('POST', ROLE_ROUTE), callback);
}

/**
 * Updates a Role based on roleId and provided data
 * @param  {String}   roleId   Role Id to Update
 * @param  {Object}   data     <a href="https://docs.connect.squareup.com/api/connect/v1/#put-roleid">PROPERTIES</a>
 * @param  {Function} callback
 */
SquareConnect.prototype.updateRole = function updateRole(roleId, data, callback) {
  this.handleRequest(this.constructOpts('PUT', `${ROLE_ROUTE}/${roleId}`), callback);
}

// ----------------------------------------------------------
//    Employee methods
// ----------------------------------------------------------

/**
 * Returns Employees based on location ID
 * @param  {Function} callback <a href="https://docs.connect.squareup.com/api/connect/v1/#get-employees">Read More</a>
 */
SquareConnect.prototype.listEmployees = function listEmployees(callback) {
  this.handleRequest(this.constructOpts(`${MERCHANT_ROUTE}/employees`), callback);
}

/**
 * Returns and Employee by employee Id
 * @param  {String}   employeeId - Employee Id to Fetch <a href="https://docs.connect.squareup.com/api/connect/v1/#get-employeeid">Read More</a>
 * @param  {Function} callback
 */
SquareConnect.prototype.getEmployee = function getEmployee(employeeId, callback) {
  this.handleRequest(this.constructOpts(`${MERCHANT_ROUTE}/${employeeId}`), callback);
}

/**
 * Creates an employee
 * @param  {Object} data <a href="https://docs.connect.squareup.com/api/connect/v1/#post-employees">Properties</a>
 * @param  {Function} callback
 */
SquareConnect.prototype.createEmployee = function createEmployee(data, callback) {
  var opts = this.constructOpts('POST', `${MERCHANT_ROUTE}/employees`);
  opts.json = data;
  this.handleRequest(opts, callback);
}

/**
 * Update Employee based on employee ID
 * @param  {String}   squareEmployeeId - Employee Id to Update
 * @param  {Object}   data        <a href="https://docs.connect.squareup.com/api/connect/v1/#put-employeeid">Properties</a>
 * @param  {Function} callback
 */
SquareConnect.prototype.updateEmployee = function updateEmployee(squareEmployeeId, data, callback) {
  var opts = this.constructOpts('PUT', `${MERCHANT_ROUTE}/employees/${squareEmployeeId}`);
  opts.json = data;
  this.handleRequest(opts, callback);
}

// ----------------------------------------------------------
//    Item methods
// ----------------------------------------------------------

/**
 * list Items based on location ID
 * @param  {Function} callback <a href="https://docs.connect.squareup.com/api/connect/v1/#get-items">Read More</a>
 */
SquareConnect.prototype.listItems = function listItems(callback) {
  this.handleRequest(this.constructOpts(`/v1/${this.locationId}/items`), callback);
}

/**
 * Creates an Item
 * @param  {Object}   data     <a href="https://docs.connect.squareup.com/api/connect/v1/#post-items">PROPERTIES</a>
 * @param  {Function} callback
 */
SquareConnect.prototype.createItem = function createItem(data, callback) {
  var opts = this.constructOpts('POST', `/v1/${this.locationId}/items`);
  opts.json = data;
  this.handleRequest(opts, callback);
}

/**
 * Fetches an Item based on Item ID
 * @param  {String}   itemId   item ID to fetch <a href="https://docs.connect.squareup.com/api/connect/v1/#get-itemid">Read More</a>
 * @param  {Function} callback
 */
SquareConnect.prototype.getItem = function getItem(itemId, callback) {
  this.handleRequest(this.constructOpts(`/v1/${this.locationId}/items/${itemId}`), callback);
}

/**
 * Updates an Item
 * @param  {String}   itemId   Item ID to update
 * @param  {Object}   data     <a href="https://docs.connect.squareup.com/api/connect/v1/#put-itemid">PROPERTIES</a>
 * @param  {Function} callback
 */
SquareConnect.prototype.updateItem = function updateItem(itemId, data, callback) {
  var opts = this.constructOpts('PUT', `/v1/${this.locationId}/items/${itemId}`);
  opts.json = data;
  this.handleRequest(opts, callback);
}

/**
 * Deletes an Item
 * @param  {String}   itemId   Item ID to delete  <a href="https://docs.connect.squareup.com/api/connect/v1/#delete-itemid">Read More</a>
 * @param  {Function} callback
 */
SquareConnect.prototype.deleteItem = function deleteItem(itemId, callback) {
  this.handleRequest(this.constructOpts('DELETE', `/v1/${this.locationId}/items/${itemId}`), callback);
}

/**
 * Uploads an Item image. This function is intended to use url based references but could be updated to use file system images. If requested,
 * it could also automatically generate the image extension via something like GraphicsMagick/ImageMagick
 * <a href="https://docs.connect.squareup.com/api/connect/v1/#post-image">Read More</a>
 * @param  {String}   itemId         Item ID to upload image for
 * @param  {String}   imageUrl       Image URL path
 * @param  {String}   imageExtension Image Extension
 * @param  {Function} callback
 */
SquareConnect.prototype.uploadItemImage = function uploadItemImage(itemId, imageUrl, imageExtension, callback) {
  var rawRequest = require('request').defaults({ encoding: null });
  var uri = `v1/${this.locationId}/items/${itemId}/image`;

  rawRequest.get(imageUrl, (err, response, body) => {
    if (err) {
      return callback(err);
    }

    var formData = {
      image_data: {
        value:  body,
        options: {
          filename: imageUrl,
          contentType: `image/${imageExtension}`
        }
      }
    };

    var headers = {
      Authorization: `Bearer ${this.accessToken}`,
      Accept: 'application/json',
      'Content-Type': 'multipart/form-data; boundary=BOUNDARY',
      'Content-Disposition': `form-data; name=image_data; filename=${imageUrl}`
    };

    var opts = {
      method: 'POST',
      uri: `${API_HOST}/${uri}`,
      headers: headers,
      formData: formData
    };

    rawRequest(opts, (err, response, body) => {
      if (err) {
        return callback(err);
      }

      if (response.statusCode !== 200) {
        return this.handleError(response, body, callback);
      }

      callback(null, body);
    });
  });
}

// ----------------------------------------------------------
//    Inventory methods
// ----------------------------------------------------------

/**
 * List Inventory of Items & Variations based on Location Id
 * @param  {Function} callback - <a href="https://docs.connect.squareup.com/api/connect/v1/#get-inventory">Read More</a>
 */
SquareConnect.prototype.listInventory = function listInventory(callback) {
  this.handleRequest(this.constructOpts(`/v1/${this.locationId}/inventory`), callback);
}

/**
 * Adjusts inventory for a variation
 * @param  {String}   variationId - variation Id to adjust/update
 * @param  {Object}   data     <a href="https://docs.connect.squareup.com/api/connect/v1/#post-inventory-variationid">PROPERTIES</a>
 * @param  {Function} callback
 */
SquareConnect.prototype.adjustInventory = function adjustInventory(variationId, data, callback) {
  var opts = this.constructOpts('POST', `/v1/${this.locationId}/inventory/${this.variationId}`);
  opts.json = data;
  this.handleRequest(opts, callback);
}

// ----------------------------------------------------------
//    Category methods
// ----------------------------------------------------------

/**
 * list Categories based on location ID
 * @param  {Function} callback - <a href="https://docs.connect.squareup.com/api/connect/v1/#get-categories">Read More</a>
 */
SquareConnect.prototype.listCategories = function listCategories(callback) {
  this.handleRequest(this.constructOpts(`/v1/${this.locationId}/categories`), callback);
}

/**
 * Creates a Category
 * @param  {Object}   data     <a href="https://docs.connect.squareup.com/api/connect/v1/#post-categories">PROPERTIES</a>
 * @param  {Function} callback
 */
SquareConnect.prototype.createCategory = function createCategory(data, callback) {
  var opts = this.constructOpts('POST', `/v1/${this.locationId}/categories`);
  opts.json = data;
  this.handleRequest(opts, callback);
}

/**
 * Updates a Category based on provided Category Id and Data
 * @param  {String}   categoryId - Category Id to update
 * @param  {Object}   data       <a href="https://docs.connect.squareup.com/api/connect/v1/#put-categoryid">PROPERTIES</a>
 * @param  {Function} callback
 */
SquareConnect.prototype.updateCategory = function updateCategory(categoryId, data, callback) {
  var opts = this.constructOpts('PUT', `/v1/${locationId}/categories/${categoryId}`);
  opts.json = data;
  this.handleRequest(opts, callback);
}

/**
 * Deletes a Category
 * @param  {String}   categoryId  - category ID to delete <a href="https://docs.connect.squareup.com/api/connect/v1/#delete-categoryid">Read More</a>
 * @param  {Function} callback
 */
SquareConnect.prototype.deleteCategory = function deleteCategory(categoryId, callback) {
  this.handleRequest(this.constructOpts('DELETE', `/v1/${this.locationId}/categories/${categoryId}`), callback);
}

// ----------------------------------------------------------
//    Variation methods
// ----------------------------------------------------------

/**
 * Creates a Variation for an already created Item
 * @param  {String}   itemId   Item ID to create the Variation for
 * @param  {Object}   data     <a href="https://docs.connect.squareup.com/api/connect/v1/#post-variations">PROPERTIES</a>
 * @param  {Function} callback
 */
SquareConnect.prototype.createVariation = function createVariation(itemId, data, callback) {
  var opts = this.constructOpts('POST', `/v1/${this.locationId}/items/${itemId}/variations`);
  opts.json = data;
  this.handleRequest(opts, callback);
}

/**
 * Updates a Variation for an already created Item and Variation
 * @param  {String}   itemId   Item ID for referencing child Variation
 * @param  {String}   variationId   Variation ID to update the Variation for
 * @param  {Object}   data     <a href="https://docs.connect.squareup.com/api/connect/v1/#put-variationid">PROPERTIES</a>
 * @param  {Function} callback
 */
SquareConnect.prototype.updateVariation = function updateVariation(itemId, variationId, data, callback) {
  var opts = this.constructOpts('PUT', `/v1/${this.locationId}/items/${itemId}/variations/${variationId}`);
  opts.json = data;
  this.handleRequest(opts, callback);
}

/**
 * Deletes a Variation for an Item
 * @param  {String}   itemId      Item ID for referencing child Variation
 * @param  {String}   variationId Variation ID to Delete <a href="https://docs.connect.squareup.com/api/connect/v1/#delete-variationid">Read More</a>
 * @param  {Function} callback
 */
SquareConnect.prototype.deleteVariation = function deleteVariation(itemId, variationId, callback) {
  this.handleRequest(this.constructOpts('DELETE', `/v1/${this.locationId}/items/{itemId}/variations/${variationId}`), callback);
}

// ----------------------------------------------------------
//    Customer Methods
// ----------------------------------------------------------
const CUSTOMER_ROUTE = '/v2/customers';
/**
 * Lists Customers via instance Auth Token
 * @param  {Function} callback <a href="https://docs.connect.squareup.com/api/connect/v2/#endpoint-listcustomers">Read More</a>
 */
SquareConnect.prototype.listCustomers = function listCustomers(callback) {
  this.handleRequest(this.constructOpts(CUSTOMER_ROUTE), callback);
}

/**
 * Fetches a customer based on Customer ID
 * @param  {String}   customerId - customer ID to fetch <a href="https://docs.connect.squareup.com/api/connect/v2/#endpoint-retrievecustomer">Read More</a>
 * @param  {Function} callback
 */
SquareConnect.prototype.getCustomer = function getCustomer(customerId, callback) {
  this.handleRequest(this.constructOpts(`${CUSTOMER_ROUTE}/${this.customerId}`), callback);
}

/**
 * Creates a customer based on provided data
 * @param  {Object}   data     <a href="https://docs.connect.squareup.com/api/connect/v2/#endpoint-createcustomer">PROPERTIES</a>
 * @param  {Function} callback
 */
SquareConnect.prototype.createCustomer = function createCustomer(data, callback) {
  var opts = this.constructOpts('POST', CUSTOMER_ROUTE);
  opts.json = data;
  this.handleRequest(opts, callback);
}

/**
 * Updates a customer based on provided Customer ID and Customer Data
 * @param  {String}   customerId - Customer ID to update
 * @param  {Object}   data       <a href="https://docs.connect.squareup.com/api/connect/v2/#endpoint-updatecustomer">PROPERTIES</a>
 * @param  {Function} callback
 */
SquareConnect.prototype.updateCustomer = function updateCustomer(customerId, data, callback) {
  var opts = this.constructOpts('PUT', `${customerId}/customerId`);
  opts.json = data;
  this.handleRequest(opts, callback);
}

/**
 * Deletes a customer based on proviced Customer Id
 * @param  {String}   customerId - Customer Id to Delete <a href="https://docs.connect.squareup.com/api/connect/v2/#endpoint-deletecustomer">Read More</a>
 * @param  {Function} callback
 */
SquareConnect.prototype.deleteCustomer = function deleteCustomer(customerId, callback) {
  this.handleRequest(this.constructOpts('DELETE', `${CUSTOMER_ROUTE}/${customerId}`), callback);
}

// ----------------------------------------------------------
//    Bank Account Methods
// ----------------------------------------------------------

/**
 * Lists Bank Accounts for an Instance
 * @param  {Function} callback <a href="https://docs.connect.squareup.com/api/connect/v1/#get-bankaccounts">Read More</a>
 */
SquareConnect.prototype.listBankAccounts = function listBankAccounts(callback) {
  this.handleRequest(this.constructOpts(`/v1/${this.locationId}/bank-accounts`), callback);
}

/**
 * Fetches a Bank Account based on Id
 * @param  {String}   bankAccountId <a href="https://docs.connect.squareup.com/api/connect/v1/#get-bankaccountid">Read More</a>
 * @param  {Function} callback
 */
SquareConnect.prototype.getBankAccount = function getBankAccount(bankAccountId, callback) {
  this.handleRequest(this.constructOpts(`/v1/${this.locationId}/bank-accounts/${bankAccountId}`), callback);
}

// ----------------------------------------------------------
//    Transaction Methods
// ----------------------------------------------------------

/**
 * lists transactions for a location, has various query parameters
 * @param  {Objects}   params  <a href="https://docs.connect.squareup.com/api/connect/v2/#endpoint-listtransactions">PROPERTIES</a>
 * @param  {Function} callback [description]
 */
SquareConnect.prototype.listTransactions = function listTransactions(params, callback) {
  callback = Array.prototype.pop.call(arguments);

  switch (arguments.length) {
    case 1:
      params = null;
  }

  var queryString = '';

  if (params) {
    queryString = constructQueryString(params);
  }

  this.handleRequest(this.constructOpts('GET', `/v2/locations/${this.locationId}/transactions${queryString}`), (err, result) => {
    /* istanbul ignore if */
    if (err) {
      return callback(err);
    }

    callback(null, result.transactions);
  });
}

/**
 * Fetches a transaction based on Transaction ID
 * @param  {String}   transactionId transaction ID to fetch <a href="https://docs.connect.squareup.com/api/connect/v2/#endpoint-retrievetransaction">Read More</a>
 * @param  {Function} callback
 */
SquareConnect.prototype.getTransaction = function getTransaction(transactionId, callback) {
  this.handleRequest(this.constructOpts('GET', `/v2/locations/${this.locationId}/transactions/${transactionId}`), callback);
}

/**
 * Voids a transaction based on Transaction ID
 * @param  {String}   transactionId - Transaction ID to void <a href="https://docs.connect.squareup.com/api/connect/v2/#endpoint-voidtransaction">Read More</a>
 * @param  {Function} callback
 */
SquareConnect.prototype.voidTransaction = function voidTransaction(transactionId, callback) {
  this.handleRequest(this.constructOpts('POST', `/v2/locations/${this.locationId}/transactions/${transactionId}/void`), callback);
}

/**
 * Charges a transaction with provided data
 * @param  {Object}   data          <a href="https://docs.connect.squareup.com/api/connect/v2/#endpoint-charge">PROPERTIES</a>
 * @param  {Function} callback
 */
SquareConnect.prototype.chargeTransaction = function chargeTransaction(data, callback) {
  var opts = this.constructOpts('POST', `/v2/locations/${this.locationId}/transactions`);
  opts.json = data;
  this.handleRequest(opts, callback);
}

/**
 * Captures a transaction based on Transaction ID
 * @param  {String}   transactionId <a href="https://docs.connect.squareup.com/api/connect/v2/#endpoint-capturetransaction">Read More</a>
 * @param  {Function} callback
 */
SquareConnect.prototype.captureTransaction = function captureTransaction(transactionId, callback) {
  this.handleRequest(this.constructOpts('POST', `/v2/locations/${this.locationId}/transactions/${transactionId}/capture`), callback);
}

// ----------------------------------------------------------
//    Payment Methods
// ----------------------------------------------------------

/**
 * lists payments based on instance location ID, has various query parameters
 * @param  {Object}   params   <a href="https://docs.connect.squareup.com/api/connect/v1/#get-payments">PROPERTIES</a>
 * @param  {Function} callback
 */
SquareConnect.prototype.listPayments = function listPayments(params, callback) {
  callback = Array.prototype.pop.call(arguments);

  switch (arguments.length) {
    case 1:
      params = null;
  }

  var queryString = '';

  if (params) {
    queryString = constructQueryString(params);
  }

  this.handleRequest(this.constructOpts('GET', `/v1/${this.locationId}/payments${queryString}`), (err, result) => {
    /* istanbul ignore if */
    if (err) {
      return callback(err);
    }

    callback(null, result);
  });
}

/**
 * fetches a payment based on payment ID
 * @param  {String}   paymentId payment ID to fetch <a href="https://docs.connect.squareup.com/api/connect/v1/#get-paymentid">Read More</a>
 * @param  {Function} callback
 */
SquareConnect.prototype.getPayment = function getPayment(paymentId, callback) {
  this.handleRequest(this.constructOpts('GET', `/v1/${this.locationId}/payments/${paymentId}`), (err, result) => {
    /* istanbul ignore if */
    if (err) {
      return callback(err);
    }

    callback(null, result);
  });
}

/**
 * Extracts AID from customer receipt based on Url, only to be used for Card Transactions
 * @param  {String}   receiptUrl - URL of payment receipt
 * @param  {Function} callback
 */
SquareConnect.prototype.getCustomerInfoFromReceipt = function getCustomerInfoFromReceipt(receiptUrl, callback) {
  var opts = {
    headers: {
      Authorization: `Bearer ${this.accessToken}`,
      Accept: 'text/html'
    },
    method: 'GET',
    uri: receiptUrl
  };

  request(opts, (err, response, body) => {
    if (err) {
      return callback(err);
    }

    var sqReceiptInfo = stripCustomerFromBody(body);
    callback(null, sqReceiptInfo);
  });
}

// ----------------------------------------------------------
//    Instance Helpers
// ----------------------------------------------------------
SquareConnect.prototype.constructOpts = function constructOpts(method, uri) {
  switch (arguments.length) {
    case 1:
      uri = method;
      method = 'GET';
  }

  const API_HEADERS = {
    Authorization: `Bearer ${this.accessToken}`,
    Accept: 'application/json'
  };

  if (uri[0] === '/') {
    uri = uri.slice(1, uri.length);
  }

  return {
    method: method,
    uri: `${API_HOST}/${uri}`,
    headers: API_HEADERS
  };
}

SquareConnect.prototype.handleRequest = function handleRequest(opts, callback) {
  request(opts, (err, response, body) => {
    /* istanbul ignore if */
    if (err) {
      return callback(err);
    }
    if (response.statusCode !== 200 ) {
      return this.handleError(response, body, callback);
    }

    if (typeof body === 'string') {
      body = JSON.parse(body);
    }

    callback(null, body);
  });
}

SquareConnect.prototype.handleError = function handleError(response, body, callback) {
  let errInfo = {
    statusCode: response.statusCode,
    message: response.statusMessage
  };

  if (this.extendedDebugInfo) {
    errInfo.body = body;
  }

  let errStr = JSON.stringify(errInfo);
  return callback(new Error(errStr));
}

// ----------------------------------------------------------
//    Utils
// ----------------------------------------------------------
function constructQueryString(params) {
  var result = '';
  var startParam = '?';
  Object.keys(params).forEach((key, idx) => {
    if (idx > 0) {
      startParam = '&'
    }
    result += `${startParam}${key}=${params[key]}`
  });
  return result;
}

function stripCustomerFromBody(body) {
  var $ = cheerio.load(body);
  var divContent = $('.chip-application-id').text();
  var AID = divContent.match(/AID: ([A-Z]\d+)/);
  var nameOnCard = $('.name_on_card').text();

  if (AID) {
    AID = AID[1];
  }

  return {AID, nameOnCard};
}
