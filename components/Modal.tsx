import { Dialog, Transition } from '@headlessui/react'
import { NextComponentType } from 'next'
import { Fragment, useState, useEffect } from 'react'
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { ethers } from 'ethers';
import DaiMock from '../artifacts/contracts/DaiMock.sol/DaiMock.json'
import Vault from '../artifacts/contracts/Vault.sol/Vault.json'


const Modal: NextComponentType = () => {
  const [open, setOpen] = useState(false)
  const [open1, setOpen1] = useState(false)
  const [amount, setAmount] = useState(1)
  const [inputValue, setInputValue] = useState(0)
  const [provider, setProvider] = useState({});
  const [balanceInEther, setBalanceInEther] = useState(0);
  const [allowanceInEther, setAllowanceInEther] = useState(0);
  const [vaultBalanceInEther, setVaultBalanceInEther] = useState(0);
  console.log(process.env.DAI_CONTRACT_ADDRESS)
  const checkBalance = async () => {
		let { ethereum } = window
		if (ethereum) {
      const provider = new ethers.providers.Web3Provider(ethereum)
      const signer = provider.getSigner()
      let DaiContractAddress = "0x625277a4951E8F37628bcdd45225AfBd94BaEfd4"
      let VaultContractAddress ="0xb91FA5CD3a6F92cAd530CC335edFbd0361d8BE70"
      console.log(DaiContractAddress)
      const DaiContract = new ethers.Contract(
        DaiContractAddress,
        DaiMock.abi,
        signer
      )
      const VaultContract = new ethers.Contract(
        VaultContractAddress,
        Vault.abi,
        signer
      )
      const balance = await DaiContract.balanceOf(signer.getAddress())
      setBalanceInEther(ethers.utils.formatEther(balance))
      console.log(balance)
      let allowance = await DaiContract.allowance(signer.getAddress(), VaultContractAddress)
      setAllowanceInEther(ethers.utils.formatEther(allowance))
      console.log(allowance)
      let vaultBalance = await VaultContract.balanceOf(signer.getAddress())
      setVaultBalanceInEther(ethers.utils.formatEther(vaultBalance))
      console.log(vaultBalance)
	}}
  async function mintDai() {
    const { ethereum } = window
		if (ethereum) {
      const provider = new ethers.providers.Web3Provider(ethereum)
    const signer = provider.getSigner()
    let DaiContractAddress = "0x625277a4951E8F37628bcdd45225AfBd94BaEfd4"
    const DaiContract = new ethers.Contract(
      DaiContractAddress,
      DaiMock.abi,
      signer
    )
   
    const mintTx = await DaiContract.mint(signer.getAddress(), ethers.utils.parseEther("100"))
    console.log('Minting....', mintTx.hash)
    const tx = await mintTx.wait()
    console.log('Minted!', tx)
    const balance = await DaiContract.balanceOf(signer.getAddress())
    setBalanceInEther(ethers.utils.formatEther(balance))
    console.log(balance)
    
  }}

  async function approveDai() {
    const { ethereum } = window
		if (ethereum) {
      const provider = new ethers.providers.Web3Provider(ethereum)
    const signer = provider.getSigner()
    let VaultContractAddress ="0xb91FA5CD3a6F92cAd530CC335edFbd0361d8BE70"
    const VaultContract = new ethers.Contract(
      VaultContractAddress,
      Vault.abi,
      signer
    )
    let DaiContractAddress = "0x625277a4951E8F37628bcdd45225AfBd94BaEfd4"
    const DaiContract = new ethers.Contract(
      DaiContractAddress,
      DaiMock.abi,
      signer
    )
    const approveTx = await DaiContract.approve(VaultContractAddress, ethers.utils.parseEther("99999999999999999"));
    console.log('Approving....', approveTx.hash)
    const tx = await approveTx.wait()
    console.log('Approved!', tx)
    
  }}

  async function DepositDai() {
    const { ethereum } = window
		if (ethereum) {
      const provider = new ethers.providers.Web3Provider(ethereum)
    const signer = provider.getSigner()
    let DaiContractAddress = "0x625277a4951E8F37628bcdd45225AfBd94BaEfd4"
    const DaiContract = new ethers.Contract(
      DaiContractAddress,
      DaiMock.abi,
      signer
    )
    let VaultContractAddress ="0xb91FA5CD3a6F92cAd530CC335edFbd0361d8BE70"
    const VaultContract = new ethers.Contract(
      VaultContractAddress,
      Vault.abi,
      signer
    )
    //set gaslimit
    if (allowanceInEther < inputValue) {
      const approveTx = await DaiContract.approve(VaultContractAddress, ethers.utils.parseEther("99999999999999999"));
      console.log('Approving....', approveTx.hash)
      const tx = await approveTx.wait()
      console.log('Approved!', tx)
    }
    const depositTx = await VaultContract.deposit(ethers.utils.parseEther(inputValue.toString()), signer.getAddress(), {gasLimit: 1000000})
    console.log('Depositing....', depositTx.hash)
    const tx = await depositTx.wait()
    console.log('Deposited!', tx)
    const balance = await DaiContract.balanceOf(signer.getAddress())
    setBalanceInEther(ethers.utils.formatEther(balance))
    console.log(balance)
    let vaultBalance = await VaultContract.balanceOf(signer.getAddress())
    setVaultBalanceInEther(ethers.utils.formatEther(vaultBalance))
    console.log(vaultBalance)

  }}

  
  useEffect(() => {checkBalance()}, []);
  // console.log(window)
 
  
  return (
    <>
      <div class="flex justify-between bg-gray-900 p-6">
        <h1 class="text-2xl font-bold text-white"><a href='#'> Daivest</a></h1>
      <ConnectButton />
      </div>
      
      <section class="bg-gray-900 text-white">
        <div class="mx-auto max-w-screen-xl px-4 py-32 lg:flex lg:h-screen lg:items-center">
          <div class="mx-auto max-w-3xl text-center">
            <h1 class="bg-gradient-to-r from-green-300 via-blue-500 to-purple-600 bg-clip-text text-3xl font-extrabold text-transparent sm:text-5xl">
              Deposit your Stables.
              <span class="sm:block"> Enjoy Passive Yields. </span>
            </h1>

            <p class="mx-auto mt-4 max-w-xl sm:text-xl sm:leading-relaxed">
              Get upto 20% APY on stable assets. Lorem ipsum dolor sit amet consectetur, fuga ducimus numquam ea!
            </p>

            <div class="mt-8 flex flex-wrap justify-center gap-4">
              <a class="block w-full rounded border border-blue-600 bg-blue-600 px-12 py-3 text-sm font-medium text-white hover:bg-transparent hover:text-white focus:outline-none focus:ring active:text-opacity-75 sm:w-auto"
                href="#deposit" onClick={() => setOpen1(true)}> Deposit </a>

              <a class="block w-full rounded border border-blue-600 px-12 py-3 text-sm font-medium text-white hover:bg-blue-600 focus:outline-none focus:ring active:bg-blue-500 sm:w-auto"
                href="#about" onClick={() => setOpen(true)}>Learn More</a>
            </div>
          </div>
        </div>
      </section>

      <Transition appear show={open} as={Fragment}>
        <Dialog
          as="div"
          className="fixed inset-0 z-10 overflow-y-auto"
          onClose={() => setOpen(false)}
        >
          <div className="min-h-screen px-4 text-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0"
              enterTo="opacity-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <Dialog.Overlay className="fixed inset-0" />
            </Transition.Child>

            <span
              className="inline-block h-screen align-middle"
              aria-hidden="true"
            >
              &#8203;
            </span>
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <div className="inline-block w-full max-w-md p-6 my-8 overflow-hidden text-left align-middle transition-all transform bg-white shadow-xl rounded-2xl">
              <section className="shadow-2xl rounded-3xl">
                  <div className="p-8 text-center sm:p-12">
                    <p className="text-sm font-semibold tracking-widest text-pink-500 uppercase">
                      Mint DAI
                    </p>


                    <div className="flex flex-col items-center mt-8">
                      <input 
                        id="amount"
                        type="text" 
                        placeholder="Enter deposit amount" 
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        className="w-full max-w-md px-4 py-3 mt-2 bg-gray-200 rounded-lg shadow-xl"
                      />
                      {/* <button
                        onClick={() => setInputValue(amount)}
                        className="p-3 ml-auto text-sm font-bold text-white bg-pink-600 rounded shadow-xl"
                      >
                        Max
                      </button> */}
                    </div>

                    <button
                      className="w-full py-4 mt-8 text-sm font-bold text-white bg-pink-600 rounded-full shadow-xl"
                      onClick={() => mintDai()}
                    >
                      Mint
                    </button>
                    <h3 className="mt-6 text-xl font-bold">
                      Dai Balance: {balanceInEther}
                    </h3>
                  </div>
                </section>
              </div>
            </Transition.Child>
          </div>
        </Dialog>
      </Transition>
      <Transition appear show={open1} as={Fragment}>
        <Dialog
          as="div"
          className="fixed inset-0 z-10 overflow-y-auto"
          onClose={() => setOpen1(false)}
        >
          <div className="min-h-screen px-4 text-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0"
              enterTo="opacity-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <Dialog.Overlay className="fixed inset-0" />
            </Transition.Child>

            <span
              className="inline-block h-screen align-middle"
              aria-hidden="true"
            >
              &#8203;
            </span>
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <div className="inline-block w-full max-w-md p-6 my-8 overflow-hidden text-center align-middle transition-all transform bg-white shadow-xl rounded-2xl">
                <Dialog.Title
                  as="h3"
                  className="text-lg font-medium leading-6 text-gray-900"
                >
                  Deposit
                </Dialog.Title>
                <section className="shadow-2xl rounded-3xl">
                  <div className="p-8 text-center sm:p-12">
                    <p className="text-sm font-semibold tracking-widest text-pink-500 uppercase">
                      Deposit DAI
                    </p>

                    <h2 className="mt-6 text-3xl font-bold">
                      Earn up to 10% APY
                    </h2>

                    <div className="flex flex-col items-center mt-8">
                      <button htmlFor="amount" className="ml-auto text-sm font-semibold tracking-widest text-gray-700 uppercase" onClick={() => setInputValue(balanceInEther)}> 
                        Balance: {balanceInEther}</button>
                      <input 
                        id="amount"
                        type="text" 
                        placeholder="Enter deposit amount" 
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        className="w-full max-w-md px-4 py-3 mt-2 bg-gray-200 rounded-lg shadow-xl"
                      />
                      {/* <button
                        onClick={() => setInputValue(amount)}
                        className="p-3 ml-auto text-sm font-bold text-white bg-pink-600 rounded shadow-xl"
                      >
                        Max
                      </button> */}
                    </div>

                    <button
                      className="w-full py-4 mt-8 text-sm font-bold text-white bg-pink-600 rounded-full shadow-xl"
                      onClick={() => DepositDai()}
                    >
                      Deposit
                    </button>
                    <h3 className="mt-6 text-xl font-bold">
                      VaultBalance: {vaultBalanceInEther}
                    </h3>
                  </div>
                </section>
              </div>
            </Transition.Child>
          </div>
        </Dialog>
      </Transition>
    </>
  )
}

export default Modal