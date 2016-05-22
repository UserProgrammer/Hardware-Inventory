$(document).ready(function () {

    // MISCELANEOUS

    // SEARCH

    // ADD DEVICE



    var DeviceOptions = Object.freeze({
        "SN" : 1,
        "Location" : 2,
        "Type" : 4,
        "Make" : 8,
        "Model": 16,
        "TagId": 32,
        "CPU" : 64,
        "OperatingSystem": 128,
        "Owner": 256
    });

    var InputFieldsRef = Object.freeze({
        "SN": $("#addDev_txt_sn"),
        "Location": $("#addDev_txt_location"),
        "Type": $("#addDev_txt_type"),
        "Make": $("#addDev_txt_make"),
        "Model": $("#addDev_txt_model"),
        "TagId": $("#addDev_txt_tagId"),
        "CPU": $("#addDev_txt_cpu"),
        "OperatingSystem": $("#addDev_txt_os"),
        "Owner": [$("#addDev_txt_first"), $("#addDev_txt_last")]
    });

    /* Keeps track of the current state in the "Add Device" screen. The possible states are:
    Blank, Create, Confirm, Change*/
    var addDevScreenState = "Blank";

  // Screen traversal (General).
  $("#menu li").click(function () {
    $("#menu li").removeClass("active");
    $(this).addClass("active");

    $(".screen").css("display", "none");
    $("#" + $(this).attr("id") + "Screen").css("display", "block");
  });

  // Function call when "Add Device" menu tab is clicked.
  $("#addDevice").click(function () {
    $("#addDev_btn_confirm").css("display", "none");
    $("#addDev_btn_cancel").css("display", "none");

    addDevScreenState = "Blank";

    // Set default value for each dropdown menu.
    setTimeout(function () {
      $.each($(".ddm-value-select"), function (key, val) {
        $(val).children().first().click();
      })
    }, 10);

    // Set "remaining characters" counter for "Comments" textarea element.
    $("#remaining_chars").text("(" + $("#addDev_txtArea_comments").attr("maxlength") + ")");
  });

  // 
  $(".ddm-value-select").click(function (event) {
    $($(this).parent().children().first()).html($(event.target).text() + " <span class=\"caret\"></span>");
  });

  // Calculate remaining characters for textarea elements.
  $(".textArea").keyup(function () {
    var charsLeft = $("#addDev_txtArea_comments").attr("maxlength") - $(this).text().length;
    $("#remaining_chars").text("(" + charsLeft + ")");
  });

  // Retrive device data for modification.
  $("#modDev_btn_retrieve").click(function () {
    var deviceSRN = $("#modDev_txt_devSRN").val();

    if (deviceSRN == "") {
      console.log("No Input!");
    } else {
      console.log(deviceSRN);
    }
  });

  // Retrieve list of selected Option for modification.
  $("#modOpt_ddm_option").click(function (event) {
      var selOption = { "option": $(event.target).attr("id") };

      console.log("Is plain object?: " + $.isPlainObject(selOption));

    $.ajax({
      method: "POST",
      url: "index.aspx/getOptionList",
      data: JSON.stringify(selOption),
      contentType: "application/json; charset=utf-8",
      dataType: "json",
      success: function (data) {
          console.log(data);

          try{
              var jsonObj = $.parseJSON(data.d);
          } catch (err) { console.log("Error:" + err.message);}
          console.log("Success!");
          console.log("Typeof: " + typeof jsonObj);
          var tablContent = "";

          // For each row:
          $.each(jsonObj, function (rowKey, rowVal) {
              tablContent += "<tr>"; // Opening table-row tag.
              // For each field:
              $.each(rowVal, function (fldKey, fldVal) {
                  tablContent += "<td>"; // Opening table-data tag.
                  tablContent += fldVal; // Data.
                  tablContent += "</td>"; // Closing table-data tag.
              })
              tablContent += "</tr>"; // Closing table-row tag.
          });

          console.log(tablContent);
          $("#modOpt_tbl_optionsListing").html(tablContent);

          $("#modifyOptionsScreen_screen1").css("display", "none");
          $("#modifyOptionsScreen_screen2").css("display", "block");
      },
      error: function (jqXHR, textStatus, errorThrown) {
        console.log("ERROR: " + textStatus + " : " + errorThrown);
      }
    });
  });

  $("#modOpt_btn_add").click(function () {
      bootbox.prompt("Enter the new value", function (input) {
          console.log(typeof input);
          if (input !== null) {
              $.ajax({
                  method: "POST",
                  url: "index.aspx/insertOption",
                  data: JSON.stringify({"option":"type", "value":input}),
                  contentType: "application/json; charset=utf-8",
                  dataType: "json",
                  success: function () {
                      bootbox.alert("Success!");
                  }
              });
          }
      });
  });

  $("#modOpt_btn_back").click(function () {
      $("#modifyOptionsScreen_screen1").css("display", "block");
      $("#modifyOptionsScreen_screen2").css("display", "none");
  });

    function isEmpty(textField) {
        if (textField.val().length == 0) {
            textField.toggleClass("mustChange");
            throw "Fields Cannot be Empty!";
        }
        return textField.val();
    }

    // This function is called when a new device is added to the database or when the new device creation process is canceled.
    function resetForm() {
        // Clear text in all text fields.
        $.each($("#addDeviceScreen").children().filter(".input"), function () {
            console.log($(this));
            $(this).val('');
        });

        // Set default (top) value in all dropdown menus.
        $.each($(".ddm-value-select"), function (key, val) {
            $(val).children().first().click();
        });
    }

    /* Sends a confirmation code which will add new data to the database.*/
    $("addDev_btn_confirm").click(function () {
        $.ajax({
            method: "POST",
            url: "index.aspx/AddDevice",
            data: "{\"reqCode\":\"confirm\", \"input\":\"\"}",
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (data) {
                // Notify the user that the device was successfully added to the database.
            },
            error: function (jqXHR, textStatus, errorThrown) { console.log(errorThrown); }
        });
    });

    /* In the Add Device screen, "Cancel" clears the contents in the input
    fields and resets the dropdown menus to their default (top) values. This
    effectively cancels the "add device" request.*/
    $("#addDev_btn_cancel").click(function () {
        resetForm();
        $("#addDev_btn_cancel").css("display", "none");
        $("#addDev_btn_confirm").css("display", "none");
        $("#addDev_btn_create").css("display", "inline");
        $("#addDev_btn_create").prop("disabled", false);
        // The input class is associated with all text fields in the "Add Device" screen.
        $(".input").removeClass("newDataField");
    });

    $("#addDeviceScreen").on("input", ".disabledState", function () {
        console.log("disabledState");
        $("#addDev_btn_create").prop("disabled", false);
        $("#addDeviceScreen").removeClass("disabledState");
    });

    // "Click" event handler for the "Add Device" button.
    $("#addDev_btn_create").click(function () {
        var input = {
            "sn": "", "location": "", "first": "", "last": "", "type": "", "make": '', "model": "",
            "tagId": "", "cpu": "", "ram": "", "storage": "", "arNum": "", "purYear": "", "os": "",
            "status": "", "comments": ""
        };

        /*Placing user input in the input object*/
        try{
            input.sn =          isEmpty( $("#addDev_txt_sn"));
            input.location =    isEmpty( $("#addDev_txt_location"));
            input.first =       isEmpty( $("#addDev_txt_first"));
            input.last =        isEmpty( $("#addDev_txt_last"));
            input.type =        isEmpty( $("#addDev_txt_type"));
            input.make =        isEmpty( $("#addDev_txt_make"));
            input.model =       isEmpty( $("#addDev_txt_model"));
            input.tagId =       isEmpty( $("#addDev_txt_tagId"));
            input.cpu =         isEmpty( $("#addDev_txt_cpu"));
            input.ram =         isEmpty($("#addDev_txt_ram-mag")) + $("#addDev_btn_ram-unit").text();
            input.storage =     isEmpty( $("#addDev_txt_strcap-mag")) + $("#addDev_btn_strcap-unit").text();
            input.arNum =       isEmpty( $("#addDev_txt_arNum"));
            input.purYear =     isEmpty( $("#addDev_txt_purYear"));
            input.os =          isEmpty( $("#addDev_txt_os"));
            input.status =      "Owned";
            input.comments =    $("#addDev_txtArea_comments");
        } catch (err) {
            // Display fade-out message to user.

            // Disable the Add Device button.
            $("#addDev_btn_create").prop("disabled", true);

            // Display Cancel button.
            $("#addDev_btn_cancel").css("display", "inline");
        }
        
        input = JSON.stringify(input);
        var reqCode = "create";



        $.ajax({
            method: "POST",
            url: "index.aspx/AddDeviceRequest",
            data: JSON.stringify({ "reqCode":"create", "input":input }),
          contentType: "application/json; charset=utf-8",
          dataType: "json",
          success: function (data) {
              console.log(data.d);
              var response = JSON.parse(data.d);

            switch (response.code) {
                case "0": // The device information was successfully added to the database.
                    // Reset the screen.
                break;

                case "1": // The provided serial number already exists. Force user to change the value.
                    // Highlight the SN input field in red.
                    // Disable the Add Device button.
                    $("#addDev_btn_create").prop("disabled", true);
                    // Display Cancel button.
                    $("#addDev_btn_cancel").css("display", "inline");
                    $("#addDev_txt_sn").addClass("disabledState");
                    $("#addDev_txt_sn").addClass("mustChange");
                break;

                /* One or more of the provided field values is new to the database. The user must either
                confirm the data or add new data.*/
                default: 
                    // Hide the Add Device button.
                    $("#addDev_btn_create").css("display", "none");
                    // Display the Confirm button.
                    $("#addDev_btn_confirm").css("display", "inline");
                    // Display Cancel button.
                    $("#addDev_btn_cancel").css("display", "inline");
                    // Highlight the fields with the new data.
                    // Convert the text value into a number.
                    
                    var responseCodeNum = Number(response.code);
                    $.each(DeviceOptions, function (key, value) {

                        if ((responseCodeNum & value) == value) {
                            // Highlight input fields.
                            console.log(InputFieldsRef[key]);
                            InputFieldsRef[key].toggleClass("canChange");
                        }
                    });
                break;
            }
          },
          error: function (jqXHR, textStatus, errorThrown) { console.log(errorThrown);}
      });
  });

    $(".input").on("input", function (event) {
        $(event.target).removeClass("newDataField");
    });

    /*asObj (auto-search object) variable holds the object which represents the composite, hmtl, auto-search "object".
    This composite "object" is made up of the text-box where the user types in the query, and the <ul> element
    which displays the suggested results.*/
  function autosearch(event, asObj) {
      var input = $(event.target).val();
      var suggList = asObj.children().filter(".suggestion-list");

      // If the text-box has no characters, hide the suggestion list.
      if (input.length == 0) {
          suggList.css("display", "none");
          autosearch.prevLen = 0;
          autosearch.suggestions = [];
          return;
      }

      if (autosearch.prevLen > input.length || autosearch.prevLen == 0 || autosearch.suggestions.length == 0) {
          var rqstData = { "input": input };

          // Run full query (AJAX data request to server).
          $.ajax({
              method: "POST",
              url: "index.aspx/getSuggestedResults",
              data: JSON.stringify(rqstData),
              contentType: "application/json; charset=utf-8",
              dataType: "json",
              success: function (data) {

                  autosearch.suggestions = $.parseJSON(data.d);
                  
                  // Empty and hide the suggestions list.
                  suggList.empty().css("display", "none");

                  // Update suggestions list.
                  if (autosearch.suggestions.length > 0) {
                    $.each(autosearch.suggestions, function (metakey, metavalue) {
                        $.each(metavalue, function (key, value) {
                            suggList.html(
                            suggList.html() + "<li class=\"suggestion-item\">" + value + "</li>"
                            );
                        });
                    });
                  }

                  // Display the updated suggestions list.
                  suggList.css("display", "table");
              }
          });
      }
      else {
          var metaTemp = [];
          // Filter existing list of values.
          $.each(autosearch.suggestions, function (metakey, metavalue) {
              var temp = [];
              $.each(metavalue, function (key, value) {
                  if (value.toLowerCase().indexOf(input.toLowerCase()) != -1) { temp.push(value); }
              });
              if(temp.length != 0){metaTemp.push(temp);}
          });

          autosearch.suggestions = metaTemp;

          // Empty and hide the suggestions list.
          suggList.empty().css("display", "none");

          // Update suggestions list.
          if (autosearch.suggestions.length > 0) {
              $.each(autosearch.suggestions, function (metakey, metavalue) {
                  $.each(metavalue, function (key, value) {
                      suggList.html(
                      suggList.html() + "<li class=\"suggestion-item\">" + value + "</li>"
                      );
                  });
              });
          }

          // Display the updated suggestions list.
          suggList.css("display", "table");
      }

      // Update static counter variable.
      autosearch.prevLen = input.length;
  }

    // Declaring & defining static variables of autosearch().
    autosearch.prevLen = 0;
    autosearch.suggestions = [];

    $(".autosearch").on("input", function (event) {
      autosearch(event, $(this));
    });

    $(".suggestion-list").focusout(function (event) {
        //setTimeout(function () {
            $(event.target).parent().children().filter(".suggestion-list").hide();
        //}, 50);
    });

    $(".suggestion-list").click(function (event) {
        $(this).parent().children().filter(".searchbar").val($(event.target).text());
        $(event.target).parent().hide();
    });
});

