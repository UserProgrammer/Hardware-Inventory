using System;
using System.Web.Services;
using System.Data;
using System.Data.SqlClient;
using System.Diagnostics;
using System.Web.Script.Serialization;

namespace PC_Inventory_Project
{
    enum DeviceInfo { SN = 1, Location = 2, Type = 4, Make = 8, Model = 16, TagId = 32, CPU = 64, OperatingSystem = 128, Owner = 256 };

    public class Device {
        public string sn {get; set;}
        public string location {get; set;}
        public string first { get; set; } // Owner's first name.
        public string last { get; set; } // Owner's last name.
        public string type {get; set;}
        public string make { get; set; }
        public string model {get; set;}
        public string tagId {get; set;}
        public string cpu {get; set;}
        public string ram {get; set;}
        public string storage {get; set;}
        public string arNum {get; set;}
        public string purYear {get; set;}
        public string os {get; set;}
        public string comments {get; set;}
        public string status {get; set;}
        public int returnCode {get; set;}
    };

    public partial class _Default : System.Web.UI.Page
    {
        static private Device newDevInfoBuffer = new Device();

        static private string connectionString = "Server=MICHAEL\\SQLEXPRESS, 120; Database=PC_Inventory; Integrated Security=true";
        static private SqlConnection connection;

        static private string parseReaderData(SqlDataReader reader)
        {
            int fieldCount = reader.FieldCount;
            object[] obj = new object[fieldCount];
            string jsonResponse = "[";

            bool moreToRead = reader.Read();

            while (moreToRead)
            {
                /// Action A (row) [
                reader.GetValues(obj);
                int itr = 0;
                bool moreFields = itr < fieldCount;

                jsonResponse += "[";
                while (moreFields)
                {
                    /// Action A (field) [
                    jsonResponse += "\"" + obj[itr].ToString() + "\"";
                    /// ] Action A (field)

                    itr++;
                    moreFields = itr < fieldCount;

                    if (moreFields) { /*Action B (field) [*/ jsonResponse += ", "; /*] Action B (field)*/}
                }
                jsonResponse += "]";                
                /// ] Action A (row)

                moreToRead = reader.Read();

                /// Verify feedback
                if (moreToRead) { /* Action B (row) [*/ jsonResponse += ", "; /*] Action B (row)*/ }
            }

            jsonResponse += "]";

            reader.Close();
            return jsonResponse;
        }

        protected void Page_Load(object sender, EventArgs e)
        {
            // Connect to the database.
            connection = new SqlConnection(connectionString);

            connection.Open();
        }

        private static void AddDeviceToDB()
        {
            // Add Device.

            newDevInfoBuffer = null;
        }

        private static string AddDeviceDataValidation(string input)
        {
            return "{\"code\":\"1\"}";
            Debug.WriteLine(input);
            JavaScriptSerializer jss = new JavaScriptSerializer();
            newDevInfoBuffer = jss.Deserialize<Device>(input);
            newDevInfoBuffer.returnCode = 0;

            Debug.WriteLine("Location: " + newDevInfoBuffer.location);

            SqlCommand command = new SqlCommand();

            command.Connection = connection;
            command.CommandType = CommandType.StoredProcedure;

            // Check if the serial number already exists.
            command.CommandText = "getSN";
            command.Parameters.Add("@snNum", SqlDbType.VarChar, 30);
            command.Parameters["@snNum"].SqlValue = newDevInfoBuffer.sn;

            // If the serial number exists, return error.
            if (command.ExecuteScalar() != null)
            {
                newDevInfoBuffer.returnCode += (int)DeviceInfo.SN;
                return "{\"code\":\"" + newDevInfoBuffer.returnCode.ToString() + "\"}";
            }

            command.Parameters.Clear();
            command.Parameters.Add("@input", SqlDbType.VarChar);

            // Check if the location exists.
            command.CommandText = "getLocation";
            command.Parameters["@input"].SqlValue = newDevInfoBuffer.location;
            Debug.WriteLine("Boop");
            if (command.ExecuteScalar() == null) { newDevInfoBuffer.returnCode += (int)DeviceInfo.Location; }

            // Check if the type exists.
            command.CommandText = "getType";
            command.Parameters["@input"].SqlValue = newDevInfoBuffer.type;
            if (command.ExecuteScalar() == null) { newDevInfoBuffer.returnCode += (int)DeviceInfo.Type; }

            // Check if the make exists.
            command.CommandText = "getMake";
            command.Parameters["@input"].SqlValue = newDevInfoBuffer.make;
            if (command.ExecuteScalar() == null) { newDevInfoBuffer.returnCode += (int)DeviceInfo.Make; }

            // Check if the model exists.
            command.CommandText = "getModel";
            command.Parameters["@input"].SqlValue = newDevInfoBuffer.model;
            if (command.ExecuteScalar() == null) { newDevInfoBuffer.returnCode += (int)DeviceInfo.Model; }

            // Check if the tagId exists.
            command.CommandText = "getTagId";
            command.Parameters["@input"].SqlValue = newDevInfoBuffer.tagId;
            if (command.ExecuteScalar() == null) { newDevInfoBuffer.returnCode += (int)DeviceInfo.TagId; }

            // Check if the CPU exists.
            command.CommandText = "getCPU";
            command.Parameters["@input"].SqlValue = newDevInfoBuffer.cpu;
            if (command.ExecuteScalar() == null) { newDevInfoBuffer.returnCode += (int)DeviceInfo.CPU; }

            // Check if the Operating System exists.
            command.CommandText = "getOS";
            command.Parameters["@input"].SqlValue = newDevInfoBuffer.os;
            if (command.ExecuteScalar() == null) { newDevInfoBuffer.returnCode += (int)DeviceInfo.OperatingSystem; }

            // Check owner's first and last name.
            command.Parameters.Clear();
            command.Parameters.Add("@first", SqlDbType.VarChar, 25);
            command.Parameters.Add("@last", SqlDbType.VarChar, 25);

            command.Parameters["@first"].SqlValue = newDevInfoBuffer.first;
            command.Parameters["@last"].SqlValue = newDevInfoBuffer.last;
            command.CommandText = "getOwner";
            if (command.ExecuteScalar() == null) { newDevInfoBuffer.returnCode += (int)DeviceInfo.Owner; }


            return "{\"code\":\"" + newDevInfoBuffer.returnCode.ToString() + "\"}";
        }

        /*Verifies the input provided by the user before adding the newDevInfoBuffer to the database.
        If the input values in the following options are not existent in the database, the
        user is prompted as to whether he wishes to add these new values to the database:
        location, type, make, model, tagId, cpu name, os, owner's first name, owner's last name*/
        [WebMethod]
        public static string AddDeviceRequest(string reqCode, string input)
        {
            switch (reqCode)
            {
                // REQUEST TYPE: CREATE
                case "create":
                    string response = AddDeviceDataValidation(input);
                    if(response == "0") { AddDeviceToDB(); }
                    return response;
                
                // REQUEST TYPE: CONFIRM
                case "confirm":
                    // Add device to the database.
                    AddDeviceToDB();
                    
                    return "{\"code\":\"0\"}";

                default:
                    return "";
            }                    
        }

        /*Queries the database for data which resembles the user input.*/
        [WebMethod]
        public static string getSuggestedResults(string input)
        {
            string query = "SELECT * FROM dbo.Make WHERE MakeName LIKE '%" + input + "%';";
            SqlCommand command = new SqlCommand(query, connection);
            command.CommandType = CommandType.Text;

            return parseReaderData(command.ExecuteReader());
        }

        /*Add an option to the database.*/
        [WebMethod]
        public static string insertOption(string option, string value)
        {
            Debug.WriteLine(option);
            Debug.WriteLine(value);

            // Create SQLCommand object & define it
            SqlCommand command = new SqlCommand();
            command.Connection = connection;
            command.CommandType = CommandType.StoredProcedure;

            switch (Enum.Parse(typeof(DeviceInfo), option).ToString())
            {
                case "location":

                    break;

                case "type":
                    command.CommandText = "dbo.addType";
                    command.Parameters.Add("@value", SqlDbType.VarChar, 25);
                    command.Parameters["@value"].SqlValue = value;
                    command.ExecuteNonQuery();
                    break;

                case "model":

                    break;

                case "make":
                    break;

                case "cpu":

                    break;

                case "os":
                    break;

                default:
                    return "Failed to add new value!";
            };

            return "New value successfully added!";
        }

        [WebMethod]
        public static string getOptionList(Object option)
        {
            Debug.WriteLine("option: " + option);
            // Create SQLCommand object & define it
            SqlCommand command = new SqlCommand();
            command.Connection = connection;
            command.CommandType = CommandType.StoredProcedure;

            switch (Enum.Parse(typeof(DeviceInfo), option.ToString()).ToString())
            {
                case "location":

                    break;

                case "Type":
                    command.CommandText = "dbo.getType";
                    command.Parameters.Add("@input");
                    command.Parameters["@input"].Value = "";
                    break;

                case "model":

                    break;

                case "make":
                    command.CommandText = "dbo.getMake";
                    break;

                case "cpu":

                    break;

                case "os":
                    command.CommandText = "dbo.getOS";
                    break;

                default:
                    return "Unknown command!";
            }

            return parseReaderData(command.ExecuteReader());
        }
    }
}
