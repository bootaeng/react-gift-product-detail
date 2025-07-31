import styled from '@emotion/styled'

export const PageWrapper = styled.div`
  max-width: 750px;
  margin: 0 auto;
`

export const ImageWrapper = styled.div`
  height: auto;
`

export const ProductImage = styled.img`
  width: 100%;
  object-fit: contain;
`

export const ImagePlaceholder = styled.div`
  width: 100%;
  height: 240px;
  background: #eee;
`

export const ContentWrapper = styled.div`
  padding: 1rem;
  text-align: left;
`

export const Title = styled.h2`
  font-weight: bold;
  font-size: 1.1rem;
`

export const Price = styled.p`
  font-size: 1.1rem;
  font-weight: 600;
`

export const BrandWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`

export const BrandImage = styled.img`
  width: 20px;
  height: 20px;
`

export const BrandName = styled.span`
  font-size: 14px;
`

export const TabBar = styled.div`
  display: flex;
  justify-content: space-around;
  border-bottom: 1px solid #ddd;
`

export const TabButton = styled.button<{ selected: boolean }>`
  padding: 1rem;
  font-weight: ${({ selected }) => (selected ? 'bold' : 'normal')};
  border-bottom: ${({ selected }) => (selected ? '2px solid black' : 'none')};
  background: none;
  border: none;
  cursor: pointer;
`

export const TabContent = styled.div`
  padding: 1rem;
  text-align: left;
`

export const DescriptionWrapper = styled.div`
  overflow-x: auto;
  min-width: 100%;
  word-break: break-word;
`

export const BottomBar = styled.div`
  position: fixed;
  bottom: 0;
  width: 100%;
  display: flex;
  height: 55px;
  border-top: 1px solid #eee;
  background-color: #fff;
  max-width: 750px;
  margin: 0 auto;
  left: 0;
  right: 0;
`

export const WishButton = styled.button`
  flex: 1;
  border: none;
  background: none;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 0.5rem;
  cursor: pointer;
`

export const WishCount = styled.span`
  font-size: 12px;
  margin-top: 2px;
`

export const OrderButton = styled.button`
  flex: 4;
  background-color: #ffeb00;
  border: none;
  font-weight: bold;
  font-size: 1.1rem;
  height: 100%;
  cursor: pointer;
`
