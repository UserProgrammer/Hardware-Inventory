<% Response.Expires = -1; %>

<%@ Page Language="C#" AutoEventWireup="true"
    CodeBehind="index.aspx.cs" Inherits="PC_Inventory_Project._Default" %>

<!DOCTYPE html>
<html>
<head>
    <title>PC Inventory</title>

    <script type="text/javascript" src="/Scripts/jquery-2.2.2.js"></script>
    <script type="text/javascript" src="/Scripts/bootstrap.min.js"></script>
    <script type="text/javascript" src="/Scripts/bootbox.min.js"></script>
    <script type="text/javascript" src="/Scripts/script.js"></script>
    
    <link type="text/css" rel="Stylesheet" href="./Content/bootstrap.min.css">
    <link type="text/css" rel="Stylesheet" href="./Styles/style.css">
</head>

<body>
    <div class="container">
        <ul id="menu" class="nav nav-tabs">
            <li id="search" class="active"><a role="button">Search</a></li>
            <li id="addDevice"><a role="button">Add Device</a></li>
            <li id="transferDevice"><a role="button">Transfer Device</a></li>
            <li id="deleteDevice"><a role="button">Delete Device</a></li>
            <li id="modifyDevice"><a role="button">Modify Device</a></li>
            <li id="modifyOptions"><a role="button">Modify Options</a></li>
        </ul>
    </div>

    <br>

    <!-- Search Screen-->
    <div class="screen" id="searchScreen">
        <div id="mod_" class="autosearch">
            <input type="text" class="form-control textField searchbar" />
            <ul class="suggestion-list"></ul>
        </div>
    </div>

    <!--Add Device Screen-->
    <div class="screen" id="addDeviceScreen">

        <!--DEVICE SERIAL NUMBER-->

        Device Serial Number
        <br>
        <input id="addDev_txt_sn" type="text" class="form-control textField input" />
        <br>

        <!--DEVICE TYPE-->

        Device Type
        <input id="addDev_txt_type" type="text" class="form-control textField input"/>
        <br>

        <!--OWNER NAME-->

        First Name
        <br>
        <input id="addDev_txt_first" type="text" class="form-control textField input" />
        <br>

        Last Name
        <br>
        <input id="addDev_txt_last" type="text" class="form-control textField input" />
        <br>

        <!--DEVICE LOCATION-->
        Device Location
        <br>
        <input id="addDev_txt_location" type="text" class="form-control textField input"/>
        <br>

        <!--DEVICE MAKE-->
        Device Make
        <br>
        <input id="addDev_txt_make" type="text" class="form-control textField input"/>
        <br>

        <!--DEVICE MODEL-->
        Device Model
        <br>
        <input id="addDev_txt_model" type="text" class="form-control textField input" />
        <br>

        <!--TAG ID-->
        Tag ID
        <br>
        <input id="addDev_txt_tagId" type="text" class="form-control textField input" />
        <br>

        <!--CENTRAL PROCESSING UNIT-->
        CPU
        <br>
        <input id="addDev_txt_cpu" type="text" class="form-control textField input" />
        <br>

        <!--RAM-->
        RAM
        <br>
        <input id="addDev_txt_ram-mag" type="text" class="form-control textField input" />

        <div id="addDev_ddm_ram" class="dropdown ddmenu">
            <button id="addDev_btn_ram-unit" class="btn btn-default dropdown-toggle" type="button" data-toggle="dropdown">
                MB
            <span class="caret"></span>
            </button>

            <ul class="dropdown-menu ddm-value-select">
                <li><a role="button">MB</a></li>
                <li><a role="button">GB</a></li>
            </ul>
        </div>
        <br>

        <!--HARD-DISK DRIVE CAPACITY-->
        Storage Capacity
        <br>
        <input id="addDev_txt_strcap-mag" type="text" class="form-control textField input" />

        <div id="addDev_ddm_strcap" class="dropdown ddmenu">
            <button id="addDev_btn_strcap-unit" class="btn btn-default dropdown-toggle" type="button" data-toggle="dropdown">
                MB
            <span class="caret"></span>
            </button>

            <ul id="add_ul_strcap-unit" class="dropdown-menu ddm-value-select">
                <li><a role="button">MB</a></li>
                <li><a role="button">GB</a></li>
                <li><a role="button">TB</a></li>
            </ul>
        </div>
        <br>

        <!--APPROPRIATION REQUEST NUMBER-->
        Appropriation Request Number
        <br>
        <input id="addDev_txt_arNum" type="text" class="form-control textField input" />
        <br>

        <!--PURCHASE YEAR-->
        Purchase Year
        <br>
        <input id="addDev_txt_purYear" type="text" class="form-control textField input" />
        <br>

        <!--OPERATING SYSTEM-->
        Operating System
        <br>
        <input id="addDev_txt_os" type="text" class="form-control textField input" />
        <br>

        <!--COMMENTS-->
        Comments
        <br>
        <textarea id="addDev_txtArea_comments" class="form-control textArea input" rows="5" cols="20" maxlength="255"></textarea>
        remaining characters <span id="remaining_chars"></span>
        <br>
        <br>

        <!--Add DEVICE BUTTON-->
        <button id="addDev_btn_create" type="button" class="btn btn-default">Add Device</button>

        <!--Confirm New Data-->
        <button id="addDev_btn_confirm" type="button" class="btn btn-default">Confirm</button>

        <!--Cancel Device Addition Request-->
        <button id="addDev_btn_cancel" type="button" class="btn btn-default">Cancel</button>
    </div>

    <!--Transfer Device Screen-->
    <div class="screen" id="transferDeviceScreen">
        Device Serial Number
      <br>
        <input id="trfDev_txt_devSRN" type="text" class="form-control textField">
        <br>
        <button id="trfDev_btn_retrieve" class="btn btn-default">Retrieve</button>
    </div>

    <!-- Delete Device Screen-->
    <div class="screen" id="deleteDeviceScreen">
        Device Serial Number
      <br>
        <input id="delDev_txt_devSRN" type="text" class="form-control textField">
        <br>
        <button type="button" class="btn btn-default">Delete</button>
    </div>

    <!-- Modify Device Screen-->
    <div class="screen" id="modifyDeviceScreen">
        Device Serial Number
      <br>
        <input id="modDev_txt_devSRN" type="text" class="form-control textField">
        <br>
        <button id="modDev_btn_retrieve" type="button" class="btn btn-default">Retrieve</button>
    </div>

    <!-- Modify Options Screen-->
    <div class="screen" id="modifyOptionsScreen">

        <div id="modifyOptionsScreen_screen1">
            <div id="modOpt_ddm_options" class="dropdown ddmenu">
                <button class="btn btn-default dropdown-toggle" type="button" data-toggle="dropdown">
                    Select Option
            <span class="caret"></span>
                </button>

                <ul id="modOpt_ddm_option" class="dropdown-menu">
                    <li><a id="location" role="button">Location</a></li>
                    <li><a id="Type" role="button">Device Type</a></li>
                    <li><a id="model" role="button">Device Model</a></li>
                    <li><a id="make" role="button">Device Make</a></li>
                    <li><a id="cpu" role="button">CPU</a></li>
                    <li><a id="os" role="button">Operating System</a></li>
                </ul>
            </div>
        </div>

        <div id="modifyOptionsScreen_screen2">
            <table id="modOpt_tbl_optionsListing" class="table table-hover table-bordered"></table>

            <br />

            <button id="modOpt_btn_add" type="button" class="btn btn-default">Add</button>
            <button id="modOpt_btn_del" type="button" class="btn btn-default">Delete</button>

            <br /><br />

            <button id="modOpt_btn_back" type="button" class="btn btn-default">Back</button>
        </div>
    </div>
</body>
</html>
