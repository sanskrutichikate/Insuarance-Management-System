import { response } from "express";
import pool from "../config/db";
//add customer
const addCustomer= async(req ,res)=>{
    try{
        const {user_id,phone,dob,address}=req.body;
    
    if(!user_id||!phone||!dob||!address){
        return response.status(400).json({
           message: "All fields are required",
        });
    }

    const result = await pool.query(
      `INSERT INTO customers (user_id, phone, dob, address)
       VALUES ($1, $2, $3, $4)
       RETURNING *`,
      [user_id, phone, dob, address]
    );

    res.status(201).json({
      message: "Customer added successfully",
      customer: result.rows[0],
    });

  } catch (error) {
    console.error("Add Customer Error:", error);

    res.status(500).json({
      message: error.message,
    });
  }
};

//getcustomer by 
const getAllCustomers = async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT
        customers.id,
        users.name,
        users.email,
        customers.phone,
        customers.dob,
        customers.address
      FROM customers
      JOIN users
      ON customers.user_id = users.id
      ORDER BY customers.id ASC
    `);

    res.status(200).json({
      message: "Customers fetched successfully",
      customers: result.rows,
    });

  } catch (error) {
    console.error("Get Customers Error:", error);

    res.status(500).json({
      message: error.message,
    });
  }
};

const getCustomerById = async (req, res) => {
  try {
    const { id } = req.params;

    const result = await pool.query(
      `
      SELECT
        customers.id,
        users.name,
        users.email,
        customers.phone,
        customers.dob,
        customers.address
      FROM customers
      JOIN users
      ON customers.user_id = users.id
      WHERE customers.id = $1
      `,
      [id]
    );

    // Customer not found
    if (result.rows.length === 0) {
      return res.status(404).json({
        message: "Customer not found",
      });
    }

    res.status(200).json({
      message: "Customer fetched successfully",
      customer: result.rows[0],
    });

  } catch (error) {
    console.error("Get Customer Error:", error);

    res.status(500).json({
      message: error.message,
    });
  }
};

// Update Customer
export const updateCustomer = async (req, res) => {
  try {
    const { id } = req.params;
    const { phone, dob, address } = req.body;

    // Check if customer exists
    const customer = await pool.query(
      "SELECT * FROM customers WHERE id = $1",
      [id]
    );

    if (customer.rows.length === 0) {
      return res.status(404).json({
        message: "Customer not found",
      });
    }

    // Update customer
    const result = await pool.query(
      `
      UPDATE customers
      SET
        phone = $1,
        dob = $2,
        address = $3
      WHERE id = $4
      RETURNING *
      `,
      [phone, dob, address, id]
    );

    res.status(200).json({
      message: "Customer updated successfully",
      customer: result.rows[0],
    });

  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: error.message,
    });
  }
};



//deletecustomer
const deleteCustomer = async (req, res) => {
  try {
    const { id } = req.params;

    // Check if customer exists
    const customer = await pool.query(
      "SELECT * FROM customers WHERE id = $1",
      [id]
    );

    if (customer.rows.length === 0) {
      return res.status(404).json({
        message: "Customer not found",
      });
    }

    // Delete customer
    await pool.query(
      "DELETE FROM customers WHERE id = $1",
      [id]
    );

    res.status(200).json({
      message: "Customer deleted successfully",
    });

  } catch (error) {
    console.error("Delete Customer Error:", error);

    res.status(500).json({
      message: error.message,
    });
  }
};

export default {addCustomer,getAllCustomers,getCustomerById,updateCustomer,deleteCustomer};