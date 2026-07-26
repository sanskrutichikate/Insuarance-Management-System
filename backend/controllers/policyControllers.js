import pool from "../config/db.js";

// Create Policy
 const createPolicy = async (req, res) => {
  try {
    const {
      customer_id,
      policy_type,
      policy_number,
      premium_amount,
      start_date,
      end_date
    } = req.body;

    // Validate input
    if (
      !customer_id ||
      !policy_type ||
      !policy_number ||
      !premium_amount ||
      !start_date ||
      !end_date
    ) {
      return res.status(400).json({
        message: "All fields are required"
      });
    }

    // Check if customer exists
    const customer = await pool.query(
      "SELECT * FROM customers WHERE id = $1",
      [customer_id]
    );

    if (customer.rows.length === 0) {
      return res.status(404).json({
        message: "Customer not found"
      });
    }

    // Insert policy
    const result = await pool.query(
      `
      INSERT INTO policies
      (
        customer_id,
        policy_type,
        policy_number,
        premium_amount,
        start_date,
        end_date
      )
      VALUES
      ($1,$2,$3,$4,$5,$6)
      RETURNING *
      `,
      [
        customer_id,
        policy_type,
        policy_number,
        premium_amount,
        start_date,
        end_date
      ]
    );

    res.status(201).json({
      message: "Policy created successfully",
      policy: result.rows[0]
    });

  } catch (error) {
    console.error("Create Policy Error:", error);

    res.status(500).json({
      message: error.message
    });
  }
};
//get policy
const getAllPolicies = async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT
        policies.id,
        policies.policy_number,
        policies.policy_type,
        policies.premium_amount,
        policies.start_date,
        policies.end_date,
        policies.status,
        users.name AS customer_name,
        users.email
      FROM policies
      JOIN customers
        ON policies.customer_id = customers.id
      JOIN users
        ON customers.user_id = users.id
      ORDER BY policies.id ASC
    `);

    res.status(200).json({
      message: "Policies fetched successfully",
      policies: result.rows,
    });

  } catch (error) {
    console.error("Get Policies Error:", error);

    res.status(500).json({
      message: error.message,
    });
  }
};


// Get Policy By ID
export const getPolicyById = async (req, res) => {
  try {
    const { id } = req.params;

    const result = await pool.query(
      `
      SELECT
        policies.id,
        policies.policy_number,
        policies.policy_type,
        policies.premium_amount,
        policies.start_date,
        policies.end_date,
        policies.status,
        users.name AS customer_name,
        users.email
      FROM policies
      JOIN customers
        ON policies.customer_id = customers.id
      JOIN users
        ON customers.user_id = users.id
      WHERE policies.id = $1
      `,
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        message: "Policy not found"
      });
    }

    res.status(200).json({
      message: "Policy fetched successfully",
      policy: result.rows[0]
    });

  } catch (error) {
    console.error("Get Policy Error:", error);

    res.status(500).json({
      message: error.message
    });
  }
};

// Update Policy
 const updatePolicy = async (req, res) => {
  try {
    const { id } = req.params;

    const {
      policy_type,
      premium_amount,
      start_date,
      end_date,
      status,
    } = req.body;

    // Check if policy exists
    const policy = await pool.query(
      "SELECT * FROM policies WHERE id = $1",
      [id]
    );

    if (policy.rows.length === 0) {
      return res.status(404).json({
        message: "Policy not found",
      });
    }

    // Update policy
    const result = await pool.query(
      `
      UPDATE policies
      SET
        policy_type = $1,
        premium_amount = $2,
        start_date = $3,
        end_date = $4,
        status = $5
      WHERE id = $6
      RETURNING *
      `,
      [
        policy_type,
        premium_amount,
        start_date,
        end_date,
        status,
        id,
      ]
    );

    res.status(200).json({
      message: "Policy updated successfully",
      policy: result.rows[0],
    });

  } catch (error) {
    console.error("Update Policy Error:", error);

    res.status(500).json({
      message: error.message,
    });
  }
};

// Delete Policy
const deletePolicy = async (req, res) => {
  try {
    const { id } = req.params;

    // Check if policy exists
    const policy = await pool.query(
      "SELECT * FROM policies WHERE id = $1",
      [id]
    );

    if (policy.rows.length === 0) {
      return res.status(404).json({
        message: "Policy not found",
      });
    }

    // Delete policy
    await pool.query(
      "DELETE FROM policies WHERE id = $1",
      [id]
    );

    res.status(200).json({
      message: "Policy deleted successfully",
    });

  } catch (error) {
    console.error("Delete Policy Error:", error);

    res.status(500).json({
      message: error.message,
    });
  }
};

export default {createPolicy,getAllPolicies,getPolicyById,updatePolicy,deletePolicy};