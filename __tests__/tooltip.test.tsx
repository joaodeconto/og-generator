import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '../components/ui/tooltip'
import { Button } from '../components/ui/button'

test('shows tooltip on hover', async () => {
  render(
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button>Hover me</Button>
        </TooltipTrigger>
        <TooltipContent>Tip content</TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )

  await userEvent.hover(screen.getByRole('button', { name: /hover me/i }))
  expect(await screen.findByRole('tooltip')).toHaveTextContent('Tip content')
})
