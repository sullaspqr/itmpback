const express = require("express");
const bodyParser = require("body-parser");
const swaggerJsDoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");
const cors = require('cors');
const crypto = require("crypto");
const { v4: uuidv4 } = require("uuid");
const app = express();
app.use(bodyParser.json()); 
const PORT = 3100;
let users = [
  { id: "1", name: "John Doe", email: "john.doe@example.com" },
  { id: "2", name: "Jane Smith", email: "jane.smith@example.com" },
  { id: "3", name: "Sam Johnson", email: "sam.johnson@example.com" },
];

// Swagger beállítások
const swaggerOptions = {
  swaggerDefinition: {
    openapi: "3.0.0",
    info: {
      title: "ITMP API",
      version: "1.0.0",
      description: "ITMP projekt API",
    },
    servers: [{ url: "http://localhost:3100" }],
  },
  apis: ["./index.js"], 
};

const swaggerDocs = swaggerJsDoc(swaggerOptions);
app.use("/swagger", swaggerUi.serve, swaggerUi.setup(swaggerDocs));

/**
 * @swagger
 * components:
 *   schemas:
 *     Users:
 *       type: object
 *       required:
 *         - name
 *         - email
 *       properties:
 *         id:
 *           type: string
 *           description: automatikusan generált ID a felhasználónak
 *         name:
 *           type: string
 *           description: a felhasználó neve
 *         email:
 *           type: string
 *           description: a felhasználó email címe
 *       example:
 *         id: "354997f7-e88b-4889-b568-81a648e8eb36"
 *         name: "John Doe"
 *         email: "john.doe@example.com"
 */

/**
 * @swagger
 * /users:
 *   get:
 *     summary: Visszatér az összes felhasználó listájával
 *     responses:
 *       200:
 *         description: Az összes felhasználó listája
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Users'
 */
app.get("/users", cors(), (req, res) => {
  res.json(users);
});

/**
 * @swagger
 * /users/{id}:
 *   get:
 *     summary: Lekér egy meghatározott ID-jű felhasználót
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: A felhasználó azonosítója
 *     responses:
 *       200:
 *         description: Megtaláltam a felhasználót
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Users'
 *       404:
 *         description: A felhasználó nem található
 */
app.get("/users/:id", cors(), (req, res) => {
  const id = req.params.id;
  const user = users.find((u) => u.id === id);

  if (!user) {
    return res.status(404).json({ message: "Ez a felhasználó nem található!" });
  }

  res.json(user);
});

/**
 * @swagger
 * /users:
 *   post:
 *     summary: Létrehoz egy új felhasználót
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Users'
 *     responses:
 *       201:
 *         description: A felhasználót sikeresen létrehoztam
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Users'
 */
app.post("/users", cors(), (req, res) => {
  try {
  const newUser = { ...req.body, id: uuidv4() };
  users.push(newUser);
  res.status(201).json(newUser);}
  catch (error) {
      console.error("Hiba történt a POST kérelem során: ", error);
      res.status(500).json({ message: "Szervehiba történt", error: error.message});
  }
});

/**
 * @swagger
 * /users/{id}:
 *   put:
 *     summary: Frissít egy meghatározott ID-jű felhasználót
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: A felhasználó azonosítója
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Users'
 *     responses:
 *       200:
 *         description: A felhasználót frissítettem
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Users'
 *       404:
 *         description: A felhasználó nem található
 */
app.put("/users/:id", cors(), (req, res) => {
  const id = req.params.id;
  const user = users.find((u) => u.id === id);

  if (!user) {
    return res.status(404).json({ message: "Ez a felhasználó nem található!" });
  }

  const updatedUser = { ...user, ...req.body };
  users = users.map((u) => (u.id === id ? updatedUser : u));
  res.json(updatedUser);
});

/**
 * @swagger
 * /users/{id}:
 *   delete:
 *     summary: Töröl egy meghatározott ID-jű felhasználót
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Felhasználó azonosítója
 *     responses:
 *       204:
 *         description: A felhasználót töröltem
 *       404:
 *         description: A felhasználó nem található
 */
app.delete("/users/:id", cors(), (req, res) => {
  const id = req.params.id;
  const user = users.find((u) => u.id === id);

  if (!user) {
    return res.status(404).json({ message: "Ez a felhasználó nem található!" });
  }

  users = users.filter((x) => x.id !== id);
  res.sendStatus(204);
});

// Indítás a megadott porton
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});