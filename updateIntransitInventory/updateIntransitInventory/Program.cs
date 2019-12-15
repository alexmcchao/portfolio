using System;

namespace updateIntransitInventory
{
    class Program
    {
        static void Main(string[] args)
        {
            mssqlConnection connection = new mssqlConnection("xxx", "xxx", "xxx", "xxx");
            connection.mainFunction();

        }
    }
}
