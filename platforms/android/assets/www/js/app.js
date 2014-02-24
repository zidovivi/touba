document.addEventListener('deviceready', function(){
        var parentElement = document.getElementById(id);
        var listeningElement = parentElement.querySelector('.listening');
        var receivedElement = parentElement.querySelector('.received');

        listeningElement.setAttribute('style', 'display:none;');
        receivedElement.setAttribute('style', 'display:block;');

        console.log('Received Event: ' + id);
}, false);
var content='';
$('#p2').on('pagecontainerbeforeload', function(event, ui){
    console.log("change content: "+content);
      $('#summary-content').empty();
      $('#summary-content').append(content);
    });
function showSummaryPage(message){
  content=message;
  console.log("navigating to summary page ");
    $( ":mobile-pagecontainer" ).pagecontainer('change', '#summary-page', {
        transition: 'flip',
        changeHash: false,
        reverse: true,
        showLoadMsg: true
    });
};
var paypalButton = document.getElementById("paypalbtn");
paypalButton.onclick = function (e) {
  window.plugins.PayPalMobile.setEnvironment("PayPalEnvironmentNoNetwork");
  // create a PayPalPayment object, usually you would pass parameters dynamically
  var amount = document.getElementById("amountpaypal").val();
  var nameOrEmail = document.getElementById("nameoremail").val();
  var payment = new PayPalPayment(amount, "USD", "Touba Donation");

  // define a callback when payment has been completed
  var completionCallback = function(proofOfPayment) {
    // TODO: Send this result to the server for verification;
    // see https://developer.paypal.com/webapps/developer/docs/integration/mobile/verify-mobile-payment/ for details.
    showSummaryPage(JSON.stringify(proofOfPayment));
    
    
    //console.log("Proof of payment: " + JSON.stringify(proofOfPayment));
  }

  // define a callback if payment has been canceled
  var cancelCallback = function(reason) {
    showSummaryPage(reason);
    //console.log("Payment cancelled: " + reason);
  }

  // launch UI, the PayPal UI will be present on screen until user cancels it or payment completed
  window.plugins.PayPalMobile.presentPaymentUI("AdMCYRCoDCGLhdGU3-IYgVCOea1pFr8B9_TBkmEvv3LlaCj6Jpj9eG5ieJdk", "yazid.wabi-facilitator@gmail.com", nameOrEmail, payment, completionCallback, cancelCallback);
};



