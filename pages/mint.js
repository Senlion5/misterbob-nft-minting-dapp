import { useState, useEffect } from 'react'
import { initOnboard } from '../utils/onboard'
import { useConnectWallet, useSetChain, useWallets } from '@web3-onboard/react'
import { config } from '../dapp.config'
import {
  getTotalMinted,
  getMaxSupply,
  isPausedState,
  isPublicSaleState,
  isPreSaleState,
  presaleMint,
  publicMint
} from '../utils/interact'

export default function Mint() {

    const [{ wallet, connecting }, connect, disconnect] = useConnectWallet()
    const [{ chains, connectedChain, settingChain }, setChain] = useSetChain()
    const connectedWallets = useWallets()
  
    const [maxSupply, setMaxSupply] = useState(0)
    const [totalMinted, setTotalMinted] = useState(0)
    const [maxMintAmount, setMaxMintAmount] = useState(0)
    const [paused, setPaused] = useState(false)
    const [isPublicSale, setIsPublicSale] = useState(false)
    const [isPreSale, setIsPreSale] = useState(false)
  
    const [status, setStatus] = useState(null)
    const [mintAmount, setMintAmount] = useState(1)
    const [isMinting, setIsMinting] = useState(false)
    const [onboard, setOnboard] = useState(null)
  
    useEffect(() => {
      setOnboard(initOnboard)
    }, [])
  
    useEffect(() => {
      if (!connectedWallets.length) return
  
      const connectedWalletsLabelArray = connectedWallets.map(
        ({ label }) => label
      )
      window.localStorage.setItem(
        'connectedWallets',
        JSON.stringify(connectedWalletsLabelArray)
      )
    }, [connectedWallets])
  
    useEffect(() => {
      if (!onboard) return
  
      const previouslyConnectedWallets = JSON.parse(
        window.localStorage.getItem('connectedWallets')
      )
  
      if (previouslyConnectedWallets?.length) {
        async function setWalletFromLocalStorage() {
          await connect({
            autoSelect: {
              label: previouslyConnectedWallets[0],
              disableModals: true
            }
          })
        }
  
        setWalletFromLocalStorage()
      }
    }, [onboard, connect])
  
    useEffect(() => {
      const init = async () => {
        setMaxSupply(await getMaxSupply())
        setTotalMinted(await getTotalMinted())
  
        setPaused(await isPausedState())
        setIsPublicSale(await isPublicSaleState())
        const isPreSale = await isPreSaleState()
        setIsPreSale(isPreSale)
  
        setMaxMintAmount(
          isPreSale ? config.presaleMaxMintAmount : config.maxMintAmount
        )
      }
  
      init()
    }, [])
  
    const incrementMintAmount = () => {
      if (mintAmount < maxMintAmount) {
        setMintAmount(mintAmount + 1)
      }
    }
  
    const decrementMintAmount = () => {
      if (mintAmount > 1) {
        setMintAmount(mintAmount - 1)
      }
    }
  
    const presaleMintHandler = async () => {
      setIsMinting(true)
  
      const { success, status } = await presaleMint(mintAmount)
  
      setStatus({
        success,
        message: status
      })
  
      setIsMinting(false)
    }
    const publicMintHandler = async () => {
      setIsMinting(true)
  
      const { success, status } = await publicMint(mintAmount)
  
      setStatus({
        success,
        message: status
      })
  
      setIsMinting(false)
    }
  
    return (
        <div className="flex flex-col items-center justify-center w-full h-full min-h-screen overflow-hidden bg-brand-background">
            <div className="relative flex flex-col items-center justify-center w-full h-full">
                <img
                    src="/images/color.png"
                    className="absolute inset-auto block object-cover w-full h-full min-h-screen animate-pulse-slow"
                />

                <div className='flex flex-col items-center w-full h-full px-4 mt-16 mb-6 justify-content md:px-10'>
                    <div className='flex flex-col items-center w-full px-2 py-2 rounded-md z-1 md:max-w-3xl bg-gray-900/90 filter backdrop-blur-sm md:px-10'>
                        
                        {wallet && (
                            <button
                                className="absolute px-4 py-2 pt-2 mt-4 ml-2 text-2xl tracking-wider uppercase transition duration-200 ease-in-out border-2 rounded-md font-mouseMemoirs left-4 bg-brand-hard-blue font-chalk border-brand-yellow text-brand-green"
                                onClick={() =>
                                    disconnect({
                                        label: wallet.label
                                    })
                                }
                            >
                                Disconnect
                            </button>
                        )}

                        <h1 className='mt-2 text-4xl text-transparent uppercase font-mouseMemoirs md:text-5xl bg-gradient-to-tr from-brand-yellow to-brand-purple bg-clip-text'>
                            {paused ? 'Paused' : isPreSale ? 'Pre-Sale' : 'Public Sale'}
                        </h1>

                        <h3 className="mt-2 text-sm tracking-widest text-brand-pink">
                            {wallet?.accounts[0]?.address
                                ? wallet?.accounts[0]?.address.slice(0, 8) +
                                    '...' +
                                    wallet?.accounts[0]?.address.slice(-4)
                                : ''}
                        </h3>

                        <div className="flex flex-col w-full mt-10 md:flex-row md:space-x-14 md:mt-14">
                            <div className="relative w-full px-2 py-2">
                                <div className='absolute z-10 flex items-center justify-center px-3 py-2 mt-2 ml-2 text-2xl bg-black border rounded-md opacity-75 text-brand-light md:text-3xl font-mouseMemoirs top-2 left-2 filter backdrop-blur-lg border-brand-purple fomt-semibold'>
                                    <p>
                                        <span className="text-brand-pink">{totalMinted}</span> /{' '}
                                            {maxSupply}
                                    </p>
                                </div>

                                <img 
                                    src='/images/23.png'
                                    className='object-cover w-full sm:h-[300px] md:w-[300px] rounded-md'
                                />
                            </div>

                            <div className='flex flex-col items-center w-full px-8 pb-4 mt-16 md:mt-0'>
                                <div className='flex items-center justify-between w-full mb-4 text-3xl font-mouseMemoirs'>
                                    <button 
                                        className='flex items-center justify-center h-10 pt-2 pb-2 font-bold bg-gray-300 rounded-md w-14 md:w-16 md:h-12 text-brand-background hover:shadow-lg'
                                        onClick={decrementMintAmount}
                                        >
                                        <svg 
                                            xmlns="http://www.w3.org/2000/svg" 
                                            className="w-6 h-6 md:h-8 md:w-8" 
                                            fill="none" 
                                            viewBox="0 0 24 24" 
                                            stroke="currentColor" 
                                            strokeWidth={2}
                                        >
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M20 12H4" />
                                        </svg>
                                    </button>

                                    <p className='flex items-center justify-center flex-1 text-4xl font-bold text-center grow text-brand-pink md:text-5xl'>
                                        {mintAmount}
                                    </p>

                                    <button 
                                        className='flex items-center justify-center h-10 pt-2 pb-2 font-bold bg-gray-300 rounded-md w-14 md:w-16 md:h-12 text-brand-background hover:shadow-lg'
                                        onClick={incrementMintAmount}
                                        >
                                        <svg 
                                            xmlns="http://www.w3.org/2000/svg" 
                                            className="w-6 h-6 md:h-8 md:w-8" 
                                            fill="none" 
                                            viewBox="0 0 24 24" 
                                            stroke="currentColor" 
                                            strokeWidth={2}>
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                                        </svg>
                                    </button>
                                </div>

                                <p className='my-3 text-sm tracking-widest text-brand-pink'>
                                    Max Mint Amount: {maxMintAmount}
                                </p>

                                <div className='w-full py-4 mt-16 border-t border-b'>
                                    <div className='flex items-center justify-between w-full text-xl font-mouseMemoirs text-brand-hard-yellow'>
                                        <p>Total</p>

                                        <div className='flex items-center space-x-3'>
                                            <p>
                                                {Number.parseFloat(config.price * mintAmount).toFixed(
                                                    2
                                                )}{' '}
                                                ETH
                                            </p>{' '}
                                            <span className='text-brand-light'>+ GAS</span>
                                        </div>
                                    </div>
                                </div>

                                { /* Mint Button && Connect Wallet Button */ }
                                {wallet ? (
                                    <button
                                        className={` ${
                                            paused || isMinting
                                            ? 'bg-gray-900 text-brand-light cursor-not-allowed'
                                            : 'bg-gradient-to-br from-brand-purple to-brand-pink shadow-lg hover:shadow-brand-pink'
                                        } font-mouseMemoirs mt-12 w-full px-6 py-3 rounded-md text-3xl mx-4 tracking-wider uppercase`}
                                        disabled={paused || isMinting}
                                        onClick={isPreSale ? presaleMintHandler : publicMintHandler}
                                    >
                                        {isMinting ? 'Minting...' : 'Mint'}
                                    </button>
                                ) : (
                                    <button
                                        className="w-full px-6 py-3 mx-4 mt-12 text-3xl tracking-wide uppercase rounded-md shadow-lg font-mouseMemoirs font-coiny bg-gradient-to-br from-brand-purple to-brand-pink hover:shadow-pink-400/50"
                                        onClick={() => connect()}
                                    >
                                        Connect Wallet
                                    </button>
                                )}
                            </div>
                        </div>

                        {/* Status */}
                        {status && (
                            <div
                                className={`border ${
                                    status.success ? 'border-brand-hard-green' : 'border-brand-hard-pink'
                                } rounded-md text-start h-full px-4 py-4 w-full mx-auto mt-8 md:mt-4"`}
                            >
                                <p className="flex flex-col space-y-2 text-brand-light text-sm md:text-base break-words ...">
                                    {status.message}
                                </p>
                            </div>
                        )}

                        {/* Contract Address */}
                        <div className='flex flex-col items-center w-full py-6 mx-8 mt-10 border-t border-brand-purple'>
                            <h3 className='mx-4 text-3xl tracking-wide uppercase font-mouseMemoirs text-brand-hard-pink'>
                                Contract Address
                            </h3>
                            <a 
                                href={`https://rinkeby.etherscan.io/address/${config.contractAddress}#readContract`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="mt-4 text-gray-400" 
                            >
                                <span className='break-all ...'>{config.contractAddress}</span>
                            </a>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    )
}