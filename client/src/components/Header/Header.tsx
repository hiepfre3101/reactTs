import { Link } from 'react-router-dom'
import { ShoppingCartOutlined, SearchOutlined, BellOutlined } from '@ant-design/icons'
import { Badge, MenuProps, theme } from 'antd'
import { Dropdown, Space } from 'antd'

import { socket } from '../../socket/config'
import { useAppDispatch, useAppSelector } from '../../hooks/redux/hooks'
import { selectAuthStatus, selectorUser } from '../../slices/authSlice'
import { itemsNavClient } from '../../configAntd/navItems'
import React, { useEffect } from 'react'
import { productSelector, cartSlice, totalSelector } from '../../slices/cartSlice'
import { itemsCart } from '../../configAntd/itemsCart'

type Props = {
   logout: () => void
}
export const logoWhiteLink =
   'https://res.cloudinary.com/diqyzhuc2/image/upload/v1683623895/hoaUi/logo-removebg-preview_pejy2r.png'
const Header = ({ logout }: Props) => {
   const isLogin = useAppSelector(selectAuthStatus)
   const user = useAppSelector(selectorUser)
   const items = itemsNavClient({ logout })
   const products = useAppSelector(productSelector)
   const total = useAppSelector(totalSelector)
   const { token } = theme.useToken()
   const dropdownMenuStyle = {
      backgroundColor: token.colorBgElevated,
      borderRadius: token.borderRadiusLG,
      boxShadow: token.boxShadowSecondary
   }
   const dispatch = useAppDispatch()
   useEffect(() => {
      socket.open()
      socket.on('connect', () => {
         console.log('connected')
      })
      socket.on('newOrder', (dataFromSer) => {
         console.log(dataFromSer.data)
      })
      return () => {
         socket.disconnect()
      }
   }, [])
   useEffect(() => {
      const cartExist = localStorage.getItem('cart')
      if (cartExist) {
         dispatch(cartSlice.actions.setCart(JSON.parse(cartExist)))
      }
   }, [])
   const itemInCart = itemsCart(products)
   return (
      <header className='overflow-hidden w-full flex justify-between items-center py-1 px-14  z-30 text-primary bg-yellowW'>
         <Link to='/' className='w-[20%] flex items-center justify-center pb-2'>
            <img src={logoWhiteLink} className='h-[70px] aspect-square scale-x-[2.5] scale-y-[2]' />
         </Link>
         <nav className='flex items-center gap-10 flex-1 justify-center'>
            <Link to={'/new'} className='text-md font-semibold'>
               New
            </Link>
            <Link to={'/bouquets'} className='text-md font-semibold'>
               Bouquets
            </Link>
            <Link to={'/flowers'} className='text-md font-semibold'>
               Flowers
            </Link>
         </nav>
         <div className='flex gap-4 justify-end w-[20%] items-center text-greenY'>
            <SearchOutlined className='cursor-pointer text-xl' />
            <BellOutlined className='cursor-pointer text-xl' />
            <Link to='/cart'>
               <Dropdown
                  menu={{ items: itemInCart }}
                  trigger={['hover']}
                  placement='bottomLeft'
                  arrow={true}
                  dropdownRender={(menu) => (
                     <div className='max-w-[500px] min-w-[400px]' style={dropdownMenuStyle}>
                        {React.cloneElement(menu as React.ReactElement, {
                           style: { boxShadow: 'none', fontFamily: 'Vollkorn, serif' }
                        })}
                        <div className='flex justify-start items-center gap-10 font-vollkorn relative p-4'>
                           <p className='text-orangeH'>Total:</p>
                           <p className='text-orangeH font-semibold text-lg'>${total}</p>
                           <Link to={'/cart'} className='absolute right-4 mb-2'>
                              <button className='bg-greenY p-2 text-white'>Check out</button>
                           </Link>
                        </div>
                     </div>
                  )}
               >
                  <Badge count={products.length} offset={[1, 1]} size='small'>
                     {' '}
                     <ShoppingCartOutlined className='cursor-pointer text-2xl text-greenY' />
                  </Badge>
               </Dropdown>
            </Link>
            {isLogin ? (
               <Dropdown menu={{ items }} trigger={['click', 'hover']}>
                  <img src={user?.avatarDefault} alt='img' className='w-[10%] aspect-square cursor-pointer' />
               </Dropdown>
            ) : (
               <Link to={'/auth'}>
                  <button className='bg-primary p-3 text-white'>Join us</button>
               </Link>
            )}
         </div>
      </header>
   )
}

export default Header
