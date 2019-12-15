using System;
using System.Collections.Generic;
using System.Text;
using System.Data.SqlClient;

namespace updateIntransitInventory
{
    class mssqlConnection
    {
        private String Data_Source;
        private String Initial_Catalog;
        private String User_ID;
        private String Password;

        public mssqlConnection(String DS, String IC, String UI, String PW)
        {
            Data_Source = DS;
            Initial_Catalog = IC;
            User_ID = UI;
            Password = PW;
        }
        public void testPrint()
        {
            String login_info = "Data Source = " + Data_Source + "; Initial Catalog = " + Initial_Catalog + "; User ID = " + User_ID + "; Password = " + Password;
            using (SqlConnection sqlconnection = new SqlConnection(login_info))
            {
                String sql = "SELECT * FROM xxx";
                SqlCommand cmd = new SqlCommand(sql, sqlconnection);
                sqlconnection.Open();
                using (SqlDataReader reader = cmd.ExecuteReader())
                {
                    while (reader.Read())
                    {
                        String myid = reader.GetInt32(0).ToString();
                        String myItemCode = reader.GetString(1);
                        String myETA = reader.GetDateTime(2).ToString("yyyy'-'MM'-'dd");
                        String myQuantity = reader.GetInt32(3).ToString();
                        String myWarehouse = reader.GetString(4).ToString();
                        String myComment = reader.GetString(5).ToString();
                        String myLine = $"id: {myid} | ItemCode: {myItemCode} | ETA: {myETA} | Quantity: {myQuantity} | Warehouse: {myWarehouse} | Comment: {myComment}";
                        Console.WriteLine(myLine);

                    }
                }
                sqlconnection.Close();

            }
        }
        public void mainFunction()
        {
            String login_info = $"Data Source = {Data_Source}; Initial Catalog = {Initial_Catalog}; User ID = {User_ID}; Password = {Password}";
            using (SqlConnection sqlconnection = new SqlConnection(login_info))
            {
                sqlconnection.Open();
                //select all records in ETA table
                SqlDataReader allETA = getETA(sqlconnection);
                if (allETA.HasRows)
                {
                    while (allETA.Read())
                    {
                        DateTime myETA = (DateTime)allETA["ETA"];
                        DateTime thisDay = DateTime.Today;
                        String myWarehouse = (String)allETA["Warehouse"];
                        //we get the column name here, and if return None, that means we don't do anything
                        String whQuantity = getWHQuantity(myETA, thisDay, myWarehouse);
                        if(whQuantity != "None")
                        {
                            String myQuantity = (String)allETA["Quantity"];
                            String myItemCode = (String)allETA["ItemCode"];
                            String myid = (String)allETA["id"];
                            String[] InventoryQuantity = getInventoryQuantity(myItemCode, sqlconnection);
                            String currentQuantity = "";
                            if(whQuantity == "SofsQuantity")
                            {
                                currentQuantity = InventoryQuantity[0];
                            }
                            else if (whQuantity == "CgQuantity")
                            {
                                currentQuantity = InventoryQuantity[1];
                            }
                            String updateQuery = $"UPDATE xxx set {whQuantity} = {whQuantity} - {myQuantity} WHERE ItemCode = '{myItemCode}'";
                            String logQuery = $"INSERT INTO xxx (ItemCode, QuantityBefore, QuantityAfter, Warehouse, ETA) VALUES('{myItemCode}', " +
                                $"'{currentQuantity}', '{currentQuantity}' - '{myQuantity}', '{myWarehouse}', '{myETA}')";
                            String deleteQuery = $"DELETE FROM xxx WHERE id = '{myid}'";
                            executeQuery(logQuery, sqlconnection);
                            executeQuery(updateQuery, sqlconnection);
                            executeQuery(deleteQuery, sqlconnection);
                        }
                        else
                        {
                            Console.WriteLine("it's not CG or SOFS");
                        }

                    }
                }
            }
        }
        private SqlDataReader getETA(SqlConnection conn)
        {
            String sql = "SELECT * FROM xxx";
            SqlCommand cmd = new SqlCommand(sql, conn);
            SqlDataReader reader = cmd.ExecuteReader();
            return reader;
        }
        private String getWHQuantity(DateTime myETA, DateTime thisDay, String myWarehouse)
        {
            if (myETA <= thisDay)
            {
                if (myWarehouse == "CG")
                {
                    return "CgQuantity";
                }
                else if (myWarehouse == "SOFS")
                {
                    return "SofsQuantity";
                }
                else
                {
                    return "None";
                }
            }
            else
            {
                return "None";
            }
        }
        private void executeQuery(String query, SqlConnection conn)
        {
            SqlCommand cmd = new SqlCommand(query, conn);
            cmd.ExecuteNonQuery();
        }
        private String[] getInventoryQuantity(String ItemCode, SqlConnection conn)
        {
            String sql = "SELECT SofsQuantity, CgQuantity FROM xxx";
            SqlCommand cmd = new SqlCommand(sql, conn);
            SqlDataReader reader = cmd.ExecuteReader();
            String[] Quantities = {};
            while (reader.Read())
            {
                String SofsQuantity = (String)reader["SofsQuantity"];
                String CgQuantity = (String)reader["CgQuantity"];
                Quantities[0] = SofsQuantity;
                Quantities[1] = CgQuantity;
            }
            return Quantities;
        }

    }
}
