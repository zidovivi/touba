/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */
var content;
var paymentResult;
var app = {
    // Application Constructor
    initialize: function() {
        this.bindEvents();
    },
    // Bind Event Listeners
    //
    // Bind any events that are required on startup. Common events are:
    // 'load', 'deviceready', 'offline', and 'online'.
    bindEvents: function() {
        document.addEventListener('deviceready', this.onDeviceReady, false);
    },
    // deviceready Event Handler
    //
    // The scope of 'this' is the event. In order to call the 'receivedEvent'
    // function, we must explicity call 'app.receivedEvent(...);'
    onDeviceReady: function() {
        app.receivedEvent('deviceready');
    },
    // Update DOM on a Received Event
    receivedEvent: function(id) {
        console.log("deviceready");

    }
};

$(document).on('pagebeforeshow', '#summary-page', function(){
    console.log("change content: ".concat(content));
      $('#summary-content').empty();
      $('#summary-content').append(content);
      
});

function showSummaryPage(message, status){
    if(status=="0"){
        content="Your confirmation number is: "+paymentResult.proof_of_payment.adaptive_payment.pay_key+
        ".<br/>Please keep it in your records."
    }else{
        content="Some errors occurs. Reason :"+message;
    }
  
  console.log("navigating to summary page ");
    $( ":mobile-pagecontainer" ).pagecontainer('change', '#summary-page', {
        transition: 'slide',
        changeHash: false,
        reverse: true,
        showLoadMsg: true
    });
    verifyProofOfPayment();
};
function verifyProofOfPayment(){
    userId="yazid.wabi-facilitator_api1.gmail.com";
    password="1391715092";
    signature="AFcWxV21C7fd0v3bYYYRCpSSRl31AB4dmXbHzk75j-J.oWJ.oFSh3k16";
    appId=paymentResult.proof_of_payment.adaptive_payment.app_id;
    payKey=paymentResult.proof_of_payment.adaptive_payment.pay_key;
    datac={"payKey":payKey.valueOf(), "requestEnvelope":{"errorLanguage":"en_US"}};
    $.ajax({
        type: 'GET',
        url: 'https://svcs.sandbox.paypal.com/AdaptivePayments/PaymentDetails',
        headers: {
            "X-PAYPAL-SECURITY-USERID": userId,
            "X-PAYPAL-SECURITY-PASSWORD": password,
            "X-PAYPAL-SECURITY-SIGNATURE": signature,
            "X-PAYPAL-APPLICATION-ID": appId,
            "X-PAYPAL-REQUEST-DATA-FORMAT": "JSON",
            "X-PAYPAL-RESPONSE-DATA-FORMAT": "JSON"
        }, 
        contentType: "application/json",      
        data: JSON.stringify(datac),
        processData: false,
        success:function(response, textStatus, jqXHR) { 
            alert(JSON.stringify(response));
        },
        error: function(jqXHR, textStatus, errorThrown){
            alert(textStatus+ " \n" + errorThrown);
        }
    });
};
$('#paypalform').submit(function(event){
    window.plugins.PayPalMobile.setEnvironment("PayPalEnvironmentSandbox");
    //create a PayPalPayment object, usually you would pass parameters dynamically
  var amount = $('#amountpaypal').val();
  var nameOrEmail = $('#nameoremail').val();
  var payment = new PayPalPayment(amount, "USD", "Touba Donation");
  //var payment = new PayPalPayment("10", "USD", "Touba Donation");

  // define a callback when payment has been completed
  var completionCallback = function(proofOfPayment) {
    // TODO: Send this result to the server for verification;
    // see https://developer.paypal.com/webapps/developer/docs/integration/mobile/verify-mobile-payment/ for details.
    paymentResult = proofOfPayment;
    showSummaryPage(JSON.stringify(proofOfPayment),"0");
    console.log("Proof of payment: " + JSON.stringify(proofOfPayment));
  }

  // define a callback if payment has been canceled
  var cancelCallback = function(reason) {
    showSummaryPage(reason, "-1");
    console.log("Payment cancelled: " + reason);
  }

  // launch UI, the PayPal UI will be present on screen until user cancels it or payment completed
  window.plugins.PayPalMobile.presentPaymentUI("AdMCYRCoDCGLhdGU3-IYgVCOea1pFr8B9_TBkmEvv3LlaCj6Jpj9eG5ieJdk", "yazid.wabi-facilitator@gmail.com", nameOrEmail, payment, completionCallback, cancelCallback);
})
