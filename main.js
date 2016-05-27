/*
Test VINS
2013 Acura MDX: 2HNYD2H42DH504765

1998 Subaru Legacy GT: 4S3BD6753W7208861

2015 mercedes-benz glk 250: WDCGG0EB8FG358249

2002 Audi A4: WAULT68E12A155612
*/
$(function() {
  $('.panel').hide();

  $('#search-form').submit(function(event) {
    event.preventDefault();
    $('.panel').slideUp();
    $('.clean').html('');
    var vin = $('#vin-search').val();
    getVinDetails(vin);
  });

  //call API with VIN
  function getVinDetails(vin) {
    var sURL = "https://service.blackbookcloud.com/UsedCarWS/UsedCarWS/UsedVehicle";
    sURL += "/" + encodeURIComponent("VIN");
    sURL += "/" + encodeURIComponent(vin);
    sURL += "?customerid=" + encodeURIComponent("kluck2");
    console.log(sURL);

    $.ajax({
      url: sURL,
      beforeSend : function(req) {
        // do nothing before send right now
      },
      dataType: 'jsonp',
      type: 'GET',
      success: function(data) {
        console.log(data);
        var sTextResult = "";
        var sPrivateValues = "";
        var sTradeInValues = "";
        var sFeatures = "";

        $.each(data.used_vehicles.used_vehicle_list, function () {
          sTextResult = this.model_year + " " + this.make + " " + this.model + " " + this.series + " " + this.style + "<br />";
          $('#vehicle-results').append('<h1>' + sTextResult + '</h1>');

          sPrivateValues = "<p>Private Party Clean: $" + this.adjusted_private_clean + "</p>";
          sPrivateValues += "<p>Private Party Average: $" + this.adjusted_private_avg + "</p>";
          sPrivateValues += "<p>Private Party Rough: $" + this.adjusted_private_rough + "</p>";
          $('#private-party').append(sPrivateValues);
          //$('#private-party-panel').slideDown();

          sTradeInValues = "<p>Trade-In Clean: $" + this.adjusted_tradein_clean + "</p>";
          sTradeInValues += "<p>Trade-In Average: $" + this.adjusted_tradein_avg + "</p>";
          sTradeInValues += "<p>Trade-In Rough: $" + this.adjusted_tradein_rough + "</p>";
          $('#trade-in').append(sTradeInValues);
          //$('#trade-in-panel').slideDown();

          sFeatures = "<p>MPG: " + this.city_mpg + "/" + this.hwy_mpg + "</p>";
          sFeatures += "<p>Horsepower: " + this.base_hp + "</p>";
          sFeatures += "<p>Airbags: " + this.airbags + "</p>";
          sFeatures += "<p>Basic Warranty: " + this.basic_warranty + "</p>";
          $('#features').append(sFeatures);
          //$('#features-panel').slideDown();

          //show all panels with slideDown()
          $('.panel').slideDown();

        });
        console.log(sTextResult);
      },
      error: function(errorThrown) {
        console.log('error is ' + errorThrown);
      }
    });
  }

  // function getToken() {
  //   var sURL = "https://service.blackbookcloud.com/UsedCarWS/UsedCarWS/Token";
  //   sURL += "/" + encodeURIComponent("Get");
  //   sURL += "?tokenminutes" + "=" + encodeURIComponent("60");
  //   sURL += "&customerid" + "=" + encodeURIComponent("kluck2");
  //   console.log(sURL);
  //   $.ajax({
  //       url: sURL,
  //       dataType: "jsonp", // jsonp required for cross-domain access
  //       type: "GET",
  //       success: function (data) {
  //         if (data.token != null) {
  //           console.log(data.token);
  //           //$("#textResult").append(data.token);
  //         }
  //       },
  //       error: function (jqXHR, textStatus, errorThrown) {
  //         console.log('error occured: ' + errorThrown);
  //         //$("#textResult").text("An error occurred: " + errorThrown);
  //       }
  //   });
  // }
  //
  // function getIP() {
  //   var sURL = "https://service.blackbookcloud.com/UsedCarWS/UsedCarWS/IPAddress";
  //   $.ajax({
  //       url: sURL,
  //       dataType: "jsonp", // jsonp required for cross-domain access
  //       type: "GET",
  //       success: function (data) {
  //         console.log(data.ip_address);
  //         //$("#textResult").append(data.ip_address);
  //       },
  //       error: function (jqXHR, textStatus, errorThrown) {
  //         //$("#textResult").text("An error occurred: " + errorThrown);
  //       }
  //   });
  // }
});
