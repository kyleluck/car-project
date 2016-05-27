/*
Test VINS
2013 Acura MDX: 2HNYD2H42DH504765

1998 Subaru Legacy GT: 4S3BD6753W7208861

2015 mercedes-benz glk 250: WDCGG0EB8FG358249

2002 Audi A4: WAULT68E12A155612
*/
$(function() {
  var selectedYear = '';
  var selectedMake = '';
  var selectedModel = '';
  var selectedSeries = '';
  var selectedStyle = '';

  $('.panel').hide();
  $('#make-select').prop("disabled", true);
  $('#model-select').hide();
  $('#series-select').hide();
  $('#style-select').hide();

  $('#vin-search-form').submit(function(event) {
    event.preventDefault();
    $('.panel').slideUp();
    $('.clean').html('');
    var vin = $('#vin-search').val();
    getVinDetails(vin);
  });

  $('#year-select').change(function() {
    event.preventDefault();
    $('.panel').slideUp();
    $('.clean').html('');
    selectedYear = $(this).val();
    $('#make-select').prop("disabled", false);
  });

  $('#make-select').change(function() {
    event.preventDefault();
    selectedMake = $(this).val();
    populateDropDown(selectedYear, selectedMake);
  });

  $('#model-select').change(function() {
    event.preventDefault();
    selectedModel = $(this).val();
    populateDropDown(selectedYear, selectedMake, selectedModel);
  });

  $('#series-select').change(function() {
    event.preventDefault();
    selectedSeries = $(this).val();
    populateDropDown(selectedYear, selectedMake, selectedModel, selectedSeries);
  });

  $('#style-select').change(function() {
    event.preventDefault();
    selectedStyle = $(this).val();
    getDrillDown();
  });

  function populateDropDown(selectedYear, selectedMake, selectedModel, selectedSeries) {
    console.log('model: ' + selectedModel);
    //return;
    var sURL = "https://service.blackbookcloud.com/UsedCarWS/UsedCarWS/Drilldown";
    sURL += "/" + encodeURIComponent("ALL");
    sURL += "/" + encodeURIComponent(selectedYear);
    sURL += "/" + encodeURIComponent(selectedMake);
    sURL += "?drilldeep" + "=" + encodeURIComponent("false");
    sURL += "&getclass" + "=" + encodeURIComponent("false");
    sURL += "&customerid" + "=" + encodeURIComponent("kluck2");
    if (selectedModel != undefined) {
      sURL += "&model=" + encodeURIComponent(selectedModel);
    }
    if (selectedSeries != undefined) {
      sURL += "&series=" + encodeURIComponent(selectedSeries);
    }
    $.ajax({
        url: sURL,
        dataType: "jsonp", // jsonp required for cross-domain access
        type: "GET",
        success: function (data) {
          var sTextResult = "";
          var sClassName = "";
          var sYearName = "";
          var buildModels = "<option value='NA'>Select a Model</option>";
          var buildSeries = "<option value='NA'>Select a Series</option>";
          var buildStyle = "<option value='NA'>Select a Style</option>";

          console.log(data);
          $.each(data.drilldown.class_list, function () {
              sClassName = this.name;
              $.each(this.year_list, function () {
                  sYearName = this.name;
                  $.each(this.make_list, function () {
                    sMakeName = this.name;
                    $.each(this.model_list, function() {
                      buildModels += "<option value='" + this.name + "'>" + this.name + "</option>";
                      if (selectedModel != undefined) {
                        $.each(this.series_list, function() {
                          buildSeries += "<option value='" + this.name + "'>" + this.name + "</option>";
                          if (selectedSeries != undefined) {
                            $.each(this.style_list, function() {
                              buildStyle += "<option value='" + this.name + "'>" + this.name + "</option>";
                            });
                          }
                        });
                      }
                    });
                  });
              });
          });
          $('#model-select').append(buildModels).show();
          if (selectedModel != undefined) {
            $('#series-select').append(buildSeries).show();
          }
          if (selectedSeries != undefined) {
            $('#style-select').append(buildStyle).show();
          }
        },
        error: function (jqXHR, textStatus, errorThrown) {
          console.log('error: ' + errorThrown);
        }
    });
  }

  //call API with VIN
  function getVinDetails(vin) {
    var sURL = "https://service.blackbookcloud.com/UsedCarWS/UsedCarWS/UsedVehicle";
    sURL += "/" + encodeURIComponent("VIN");
    sURL += "/" + encodeURIComponent(vin);
    sURL += "?customerid=" + encodeURIComponent("kluck2");

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
        displayVehicleData(data);
      },
      error: function(errorThrown) {
        console.log('error is ' + errorThrown);
      }
    });
  }

  function getDrillDown() {
    var sURL = "https://service.blackbookcloud.com/UsedCarWS/UsedCarWS/UsedVehicle";
    sURL += "/" + encodeURIComponent(selectedYear);
    sURL += "/" + encodeURIComponent(selectedMake);
    sURL += "?model" + "=" + encodeURIComponent(selectedModel);
    sURL += "&series" + "=" + encodeURIComponent(selectedSeries);
    sURL += "&style" + "=" + encodeURIComponent(selectedStyle);
    sURL += "&customerid" + "=" + encodeURIComponent("kluck2");
    $.ajax({
        url: sURL,
        dataType: "jsonp", // jsonp required for cross-domain access
        type: "GET",
        success: function (data) {
          console.log('drilldown data: ', data);
          // var sTextResult = "";
          // var sMakeName = "";
          // var sYearName = "";
          // $.each(data.used_vehicles.used_vehicle_list, function () {
          //     sTextResult += this.model_year + " " + this.make + " " + this.model + " " + this.series + " " + this.style + "<br />";
          // });
          displayVehicleData(data);
        },
        error: function (jqXHR, textStatus, errorThrown) {
          console.log('error: ' + errorThrown);
        }
    });
  }

  function displayVehicleData(data) {
    $.each(data.used_vehicles.used_vehicle_list, function () {
      sTextResult = this.model_year + " " + this.make + " " + this.model + " " + this.series + " " + this.style + "<br />";
      $('#vehicle-results').append('<h1>' + sTextResult + '</h1>');

      sPrivateValues = "<p>Private Party Clean: $" + this.adjusted_private_clean + "</p>";
      sPrivateValues += "<p>Private Party Average: $" + this.adjusted_private_avg + "</p>";
      sPrivateValues += "<p>Private Party Rough: $" + this.adjusted_private_rough + "</p>";
      $('#private-party').append(sPrivateValues);

      sTradeInValues = "<p>Trade-In Clean: $" + this.adjusted_tradein_clean + "</p>";
      sTradeInValues += "<p>Trade-In Average: $" + this.adjusted_tradein_avg + "</p>";
      sTradeInValues += "<p>Trade-In Rough: $" + this.adjusted_tradein_rough + "</p>";
      $('#trade-in').append(sTradeInValues);

      sFeatures = "<p>MPG: " + this.city_mpg + "/" + this.hwy_mpg + "</p>";
      sFeatures += "<p>Horsepower: " + this.base_hp + "</p>";
      sFeatures += "<p>Torque: " + this.torque + "</p>";
      sFeatures += "<p>Airbags: " + this.airbags + "</p>";
      sFeatures += "<p>Basic Warranty: " + this.basic_warranty + "</p>";
      $('#features').append(sFeatures);

      //show all panels with slideDown()
      $('.panel').slideDown();
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
