import { useParams, useNavigate } from 'react-router-dom'
import Layout from '@/components/Layout'
import RecipientOverlay from '@/components/RecipientOverlay'
import { useState, useEffect } from 'react'
import CardData from '@/data/CardData'
import type { Recipient } from '@/components/RecipientOverlay'
import { PATHS } from '@/Root'
import { STORAGE_KEY_USER } from '@/contexts/AuthContext'
import {
  Container,
  Section,
  CardScroll,
  CardThumb,
  CardPreview,
  MessageInput,
  Label,
  InfoText,
  Input,
  ProductInfo,
  ProductDetails,
  Brand,
  Price,
  OrderBar,
  OrderPrice,
  ErrorText,
  RecipientTable,
} from '@/styles/OrderPage.styled'
import { toast } from 'react-toastify'
import { useQuery } from '@tanstack/react-query'

export const OrderPage = () => {
  const { productId } = useParams()
  const navigate = useNavigate()

  const {
    data: product,
    isLoading: isProductLoading,
    isError,
  } = useQuery({
    queryKey: ['productSummary', productId],
    queryFn: async () => {
      const res = await fetch(`/api/products/${productId}/summary`)
      if (!res.ok) {
        if (res.status === 404) {
          toast.error('존재하지 않는 상품입니다.')
          navigate(PATHS.HOME)
        } else {
          const text = await res.text()
          throw new Error(`주문 실패: ${text}`)
        }
      }

      const json = await res.json()
      if (!json?.data || typeof json.data.price !== 'number') {
        toast.error('상품 정보가 올바르지 않습니다.')
        return null
      }
      return json.data
    },
    enabled: !!productId,
    retry: false,
    onError: () => {
      toast.error('상품 정보 요청 중 오류 발생')
      navigate(PATHS.HOME)
    },
  })

  const [orderCompleted, setOrderCompleted] = useState(false)
  const [selectedCardId, setSelectedCardId] = useState(CardData[0]?.id || null)
  const selectedCard = CardData.find((card) => card.id === selectedCardId)

  const [message, setMessage] = useState(selectedCard?.defaultTextMessage || '')
  const [senderName, setSenderName] = useState('')
  const [recipients, setRecipients] = useState<Recipient[]>([])
  const [recipientOverlayOpen, setRecipientOverlayOpen] = useState(false)

  const [formErrors, setFormErrors] = useState({
    message: '',
    senderName: '',
    recipients: '',
  })

  useEffect(() => {
    const userInfo = JSON.parse(localStorage.getItem(STORAGE_KEY_USER) || '{}')
    if (userInfo?.name) {
      setSenderName(userInfo.name)
    }
  }, [])

  const handleOrder = async () => {
    const errors = {
      message: '',
      senderName: '',
      recipients: '',
    }

    if (!message.trim()) errors.message = '메시지를 입력해주세요.'
    if (!senderName.trim())
      errors.senderName = '보내는 사람 이름을 입력해주세요.'
    if (recipients.length === 0)
      errors.recipients = '받는 사람을 한 명 이상 추가해주세요.'

    setFormErrors(errors)
    const hasErrors = Object.values(errors).some((e) => e)
    if (hasErrors) return

    const storedUserInfo = localStorage.getItem('userInfo')
    let authHeader = ''
    if (storedUserInfo) {
      const userInfo = JSON.parse(storedUserInfo)
      if (userInfo.authToken) {
        authHeader =
          userInfo.authToken === 'dummy-token'
            ? userInfo.authToken
            : `Bearer ${userInfo.authToken}`
      }
    }

    try {
      const res = await fetch('/api/order', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: authHeader,
        },
        body: JSON.stringify({
          productId: Number(productId),
          ordererName: senderName,
          messageCardId: String(selectedCardId),
          message,
          receivers: recipients.map((r) => ({
            name: r.name,
            phoneNumber: String(r.phone),
            quantity: r.quantity,
          })),
        }),
      })

      if (!res.ok) {
        const text = await res.text()
        if (res.status === 401) {
          toast.error('로그인이 필요합니다.')
          navigate(PATHS.LOGIN)
          return
        }

        toast.error(`주문 실패: ${text}`)
        return
      }

      toast.success('주문이 완료되었습니다.')
      setOrderCompleted(true)
      navigate(PATHS.HOME)
    } catch (err) {
      toast.error('주문 요청 중 오류가 발생했습니다.')
    }
  }

  const totalQuantity = recipients.reduce((sum, r) => sum + r.quantity, 0)
  const totalPrice =
    typeof product?.price === 'number' && totalQuantity
      ? product.price * totalQuantity
      : 0

  return (
    <Layout>
      <Container>
        <CardScroll>
          {CardData.map((card) => (
            <CardThumb
              key={card.id}
              selected={card.id === selectedCardId}
              onClick={() => {
                setSelectedCardId(card.id)
                setMessage(card.defaultTextMessage || '')
              }}
            >
              <img src={card.thumbUrl} alt={card.defaultTextMessage} />
            </CardThumb>
          ))}
        </CardScroll>

        <CardPreview>
          <img
            src={selectedCard?.imageUrl}
            alt={selectedCard?.defaultTextMessage}
          />
        </CardPreview>

        <Section>
          <MessageInput
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />
          {formErrors.message && <ErrorText>{formErrors.message}</ErrorText>}
        </Section>

        <Section>
          <Label>보내는 사람</Label>
          <Input
            placeholder="이름을 입력하세요."
            value={senderName}
            onChange={(e) => setSenderName(e.target.value)}
          />
          {formErrors.senderName && (
            <ErrorText>{formErrors.senderName}</ErrorText>
          )}
          <InfoText>* 실제 선물 발송 시 발신자 이름으로 반영됩니다.</InfoText>
        </Section>

        <Section>
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '0.75rem',
            }}
          >
            <Label>받는 사람</Label>
            <button
              type="button"
              onClick={() => setRecipientOverlayOpen(true)}
              style={{
                border: '1px solid #ddd',
                background: '#f5f5f5',
                padding: '0.4rem 0.8rem',
                borderRadius: '6px',
                fontSize: '0.9rem',
                cursor: 'pointer',
              }}
            >
              수정
            </button>
          </div>

          {recipients.length === 0 ? (
            <div
              style={{
                border: '1px solid #eee',
                borderRadius: '8px',
                padding: '40px 0',
                textAlign: 'center',
                color: '#aaa',
                fontSize: '0.9rem',
                maxHeight: '150px',
              }}
            >
              받는 사람이 없습니다.
              <br />
              받는 사람을 추가해주세요.
            </div>
          ) : (
            <RecipientTable>
              <thead>
                <tr>
                  <th>이름</th>
                  <th>전화번호</th>
                  <th>수량</th>
                </tr>
              </thead>
              <tbody>
                {recipients.map((r, i) => (
                  <tr key={i}>
                    <td>{r.name}</td>
                    <td>{r.phone}</td>
                    <td>{r.quantity}</td>
                  </tr>
                ))}
              </tbody>
            </RecipientTable>
          )}

          {formErrors.recipients && (
            <ErrorText>{formErrors.recipients}</ErrorText>
          )}
        </Section>

        <Section>
          <Label>상품 정보</Label>
          <ProductInfo>
            {product?.imageURL ? (
              <img
                src={product.imageURL}
                alt={product.name}
                style={{
                  width: '80px',
                  height: '80px',
                  borderRadius: '8px',
                  objectFit: 'cover',
                }}
              />
            ) : (
              <div
                style={{
                  width: '80px',
                  height: '80px',
                  background: '#eee',
                }}
              />
            )}

            <ProductDetails>
              <div style={{ fontWeight: 600 }}>{product?.name || ''}</div>
              <Brand>{product?.brandInfo?.name || ''}</Brand>
              <Price>
                <span
                  style={{
                    fontSize: '0.9rem',
                    color: '#888',
                    fontWeight: 'normal',
                  }}
                >
                  상품가{' '}
                </span>
                {product?.price.toLocaleString() || 0}원
              </Price>
            </ProductDetails>
          </ProductInfo>
        </Section>
      </Container>

      <OrderBar onClick={handleOrder}>
        <OrderPrice>{totalPrice.toLocaleString()}원 주문하기</OrderPrice>
      </OrderBar>

      {recipientOverlayOpen && (
        <RecipientOverlay
          defaultRecipients={recipients}
          onComplete={(list, shouldClose) => {
            setRecipients(list)
            if (shouldClose) {
              setRecipientOverlayOpen(false)
            }
          }}
          onClose={() => setRecipientOverlayOpen(false)}
        />
      )}
    </Layout>
  )
}

export default OrderPage
