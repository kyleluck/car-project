/*
Test VINS
2013 Acura MDX: 2HNYD2H42DH504765

1998 Subaru Legacy GT: 4S3BD6753W7208861

2015 mercedes-benz glk 250: WDCGG0EB8FG358249

2002 Audi A4: WAULT68E12A155612
*/
$(function() {
  $('#search-form').submit(function(event) {
    event.preventDefault();
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
        var sMakeName = "";
        var sYearName = "";
        $.each(data.used_vehicles.used_vehicle_list, function () {
          sTextResult += this.model_year + " " + this.make + " " + this.model + " " + this.series + " " + this.style + "<br />";

          $('#vehicle-results').append('<p>' + sTextResult + '</p>');
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
