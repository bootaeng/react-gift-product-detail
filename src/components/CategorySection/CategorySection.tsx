import styled from '@emotion/styled'
import { useNavigate } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'

const Section = styled.section`
  background-color: ${({ theme }) => theme.colors.background.default};
  border-radius: 12px;
  padding: ${({ theme }) => theme.spacing.spacing5};
  margin-top: ${({ theme }) => theme.spacing.spacing6};
`

const Title = styled.h3`
  ${({ theme }) => theme.typography.title2Bold};
  margin-bottom: ${({ theme }) => theme.spacing.spacing4};
  color: ${({ theme }) => theme.colors.text.default};
`

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: ${({ theme }) => theme.spacing.spacing4};
`

const Item = styled.button`
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  border: none;
  outline: none;
  cursor: pointer;
  padding: ${({ theme }) => theme.spacing.spacing3};
  border-radius: 12px;
  transition: background-color 0.2s;
  &:hover {
    background-color: ${({ theme }) => theme.colors.background.subtle};
  }

  &:focus,
  &:active {
    outline: none;
  }
`

const Image = styled.img`
  width: ${({ theme }) => theme.spacing.spacing14};
  height: ${({ theme }) => theme.spacing.spacing14};
  border-radius: 20%;
`

const Label = styled.p`
  ${({ theme }) => theme.typography.body2Regular};
  margin-top: ${({ theme }) => theme.spacing.spacing2};
  color: ${({ theme }) => theme.colors.text.default};
`

const fetchThemes = async () => {
  const res = await fetch('/api/themes')
  const json = await res.json()
  return json.data
}

export const CategorySection = () => {
  const navigate = useNavigate()

  const {
    data: themes = [],
    isLoading,
    isError,
  } = useQuery({
    queryKey: ['themes'],
    queryFn: fetchThemes,
  })

  const handleThemeClick = (themeId: number) => {
    navigate(`/category/${themeId}`)
  }

  if (isLoading) return <Section>로딩 중...</Section>
  if (isError) return <Section>데이터 로딩 실패</Section>

  return (
    <Section>
      <Title>선물 테마</Title>
      <Grid>
        {themes.map(({ themeId, name, image }) => (
          <Item key={themeId} onClick={() => handleThemeClick(themeId)}>
            <Image src={image} alt={name} />
            <Label>{name}</Label>
          </Item>
        ))}
      </Grid>
    </Section>
  )
}
