# Blue Carbon Project 🌊🌱

A blockchain-based platform for verifying and tokenizing blue carbon projects. This platform uses AI to analyze coastal ecosystem images and issues carbon credits as NFTs.

## Features 🚀

- **Blockchain Integration**: Smart contract deployment on Polygon Network
- **AI Analysis**: Image processing for carbon credit calculation
- **NFT Minting**: Convert carbon credits into tradeable NFTs
- **Project Management**: Track and manage blue carbon projects
- **Verification System**: Verified organization status for project validation

## Tech Stack 💻

- **Frontend**: React.js, TailwindCSS
- **Backend**: Node.js, Express
- **Blockchain**: Ethereum/Polygon, Solidity
- **AI/ML**: Python (for image analysis)
- **Storage**: IPFS (for decentralized storage)

## Prerequisites 📋

- Node.js (v14 or higher)
- Python 3.x (for AI model)
- MetaMask wallet
- Git

## Installation 🔧

1. Clone the repository:

```bash
git clone https://github.com/yourusername/blue-carbon-project.git
cd blue-carbon-project
```

2. Install dependencies:

```bash
# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../frontend
npm install
```

3. Set up environment variables:

```bash
# In backend/.env
CONTRACT_ADDRESS=your_contract_address
PRIVATE_KEY=your_private_key
RPC_URL=your_rpc_url
PORT=3001

# In frontend/.env
REACT_APP_BACKEND_URL=http://localhost:3001
```

## Running the Application 🏃‍♂️

1. Start the backend server:

```bash
cd backend
npm start
```

2. Start the frontend development server:

```bash
cd frontend
npm start
```

3. Access the application at `http://localhost:3000`

## API Endpoints 📡

- `POST /api/projects`: Create a new project
- `GET /api/projects/user/:address`: Get user's projects
- `GET /api/projects/:id`: Get single project details
- `GET /api/stats`: Get platform statistics
- `GET /api/verify/:address`: Check if address is verified
- `GET /api/admin`: Get admin address
- `POST /api/admin/verify-org`: Add verified organization

## Smart Contract Functions 📘

- `createProject`: Create a new blue carbon project
- `verifyProjectAndIssueCredits`: Verify project and issue carbon credits
- `addVerifiedOrganization`: Add a verified organization
- `getPlatformStats`: Get platform statistics
- `getProject`: Get project details

## Project Structure 📁

```
blue-carbon-project/
├── backend/
│   ├── server.js
│   ├── app.js
│   ├── ai_results/
│   ├── controllers/
│   ├── routes/
│   ├── models/
│   └── contracts/
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   └── App.js
│   └── public/
└── README.md
```

## Contributing 🤝

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License 📝

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments 🙏

- [OpenZeppelin](https://openzeppelin.com/) for smart contract libraries
- [IPFS](https://ipfs.io/) for decentralized storage
- [Polygon](https://polygon.technology/) for blockchain infrastructure