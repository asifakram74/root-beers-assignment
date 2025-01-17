// ** Util Import
import { hexToRGBA } from '../../components/common/hex-to-rgba'

const Tooltip = theme => {
  return {
    MuiTooltip: {
      styleOverrides: {
        tooltip: {
          borderRadius: 6,
          lineHeight: 1.455,
          backgroundColor: hexToRGBA(theme.palette.customColors.tooltipBg, 0.9)
        },
        arrow: {
          color: hexToRGBA(theme.palette.customColors.tooltipBg, 0.9)
        }
      }
    }
  }
}

export default Tooltip
