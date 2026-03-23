// export default defineOAuthFacebookEventHandler({
//     config: {
//         scope: ['email', 'public_profile'],
//         fields: ['id', 'name', 'email', 'picture.type(large)'],
//         authorizationParams: {
//             auth_type: 'reauthenticate',
//         },
//     },

//     async onSuccess(event, { user }) {
//         const config = useRuntimeConfig(event)
//         const { email, name, picture, id } = user
//         const sub = id || user.sub

//         let avatarUrl: string | undefined = undefined
//         if (typeof picture === 'string') {
//             avatarUrl = picture
//         } else if (
//             picture &&
//             typeof picture === 'object' &&
//             picture.data?.url
//         ) {
//             avatarUrl = String(picture.data.url)
//         }

//         if (!email) {
//             const message = encodeURIComponent(
//                 'ไม่พบที่อยู่อีเมลในบัญชี Facebook ของคุณ'
//             )
//             return sendRedirect(event, `/?auth=error&message=${message}`)
//         }

//         try {
//             const authHeader = buildWooAuth(config)
//             const wpUrl = config.public.wpUrl as string
//             const socialPassword = `${sub}${config.wpAppPassword}`

//             let wpUser = await wooFindCustomerByEmail(
//                 email,
//                 authHeader,
//                 wpUrl
//             ).catch((err: unknown) => {
//                 console.error('WC Customer Search Error:', err)
//                 return null
//             })

//             if (wpUser) {
//                 const currentAvatar = wpUser.meta_data?.find(
//                     (m: any) => m.key === 'social_avatar_url'
//                 )?.value

//                 if (currentAvatar !== avatarUrl) {
//                     await wooUpdateCustomer(
//                         wpUser.id,
//                         {
//                             meta_data: [
//                                 { key: 'social_avatar_url', value: avatarUrl },
//                             ],
//                         },
//                         authHeader,
//                         wpUrl
//                     ).catch((err: unknown) =>
//                         console.error('WC Customer Update Error:', err)
//                     )
//                 }
//             } else {
//                 const nameParts = (name || '').split(' ')
//                 const firstName = nameParts[0] || ''
//                 const lastName = nameParts.slice(1).join(' ') || ''
//                 const safeUsername = email.split('@')[0]

//                 try {
//                     wpUser = await wooCreateCustomer(
//                         {
//                             username: safeUsername,
//                             email,
//                             password: socialPassword,
//                             first_name: firstName,
//                             last_name: lastName,
//                             meta_data: [
//                                 { key: 'social_avatar_url', value: avatarUrl },
//                             ],
//                         },
//                         authHeader,
//                         wpUrl
//                     )
//                 } catch (error: any) {
//                     throw createError({
//                         statusCode: 500,
//                         statusMessage: `สร้างบัญชีไม่สำเร็จ: ${error.data?.message || 'Unknown Error'}`,
//                     })
//                 }
//             }

//             // Social login: ไม่ต้องใช้ JWT ตั้ง session โดยตรงเลย
//             const fullName =
//                 wpUser?.first_name && wpUser?.last_name
//                     ? `${wpUser.first_name} ${wpUser.last_name}`.trim()
//                     : wpUser?.first_name || name

//             await setUserSession(event, {
//                 user: {
//                     name: fullName,
//                     email: wpUser.email || email,
//                     avatar: picture,
//                     nicename: wpUser.username || email.split('@')[0],
//                 },
//                 secure: {
//                     provider: 'facebook',
//                 },
//                 loggedInAt: new Date().toISOString(),
//             })

//             return sendRedirect(event, '/?auth=success')
//         } catch (error: any) {
//             const message = encodeURIComponent(
//                 error.statusMessage || 'เกิดข้อผิดพลาด กรุณาลองใหม่'
//             )
//             return sendRedirect(event, `/?auth=error&message=${message}`)
//         }
//     },

//     onError(event, error) {
//         const message = encodeURIComponent(
//             'คุณได้ยกเลิกการเข้าสู่ระบบ หรือเกิดข้อผิดพลาดจาก Facebook'
//         )
//         return sendRedirect(event, `/?auth=error&message=${message}`)
//     },
// })
