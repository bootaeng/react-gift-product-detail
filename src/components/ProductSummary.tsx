import React from 'react'
import {
  ImageWrapper,
  ProductImage,
  ImagePlaceholder,
  ContentWrapper,
  Title,
  Price,
  BrandWrapper,
  BrandImage,
  BrandName,
} from '@/styles/detail'

interface ProductSummaryProps {
  product: {
    name: string
    price?: { sellingPrice: number }
    imageURL?: string
    brandInfo?: { imageURL: string; name: string }
  }
}

const ProductSummary = ({ product }: ProductSummaryProps) => {
  return (
    <>
      <ImageWrapper>
        {product.imageURL ? (
          <ProductImage src={product.imageURL} alt={product.name} />
        ) : (
          <ImagePlaceholder />
        )}
      </ImageWrapper>

      <ContentWrapper>
        <Title>{product.name}</Title>
        <Price>{product.price?.sellingPrice.toLocaleString()}원</Price>
        <BrandWrapper>
          <BrandImage
            src={product.brandInfo?.imageURL}
            alt={product.brandInfo?.name}
          />
          <BrandName>{product.brandInfo?.name}</BrandName>
        </BrandWrapper>
      </ContentWrapper>
    </>
  )
}

export default ProductSummary
