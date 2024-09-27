/** @format */

import { useState } from "react";
import { Outlet } from "react-router-dom";
import Box from '@mui/material/Box'
import AppBar from "./NavBar/AppBar";
// material
import { styled } from "@mui/material/styles";
import themeConfig from '../../configs/themeConfig'
import Footer from "../Footer/Footer";

// ----------------------------------------------------------------------

import { deepmerge } from '@mui/utils'
import CssBaseline from '@mui/material/CssBaseline'
import GlobalStyles from '@mui/material/GlobalStyles'
import { ThemeProvider, createTheme, responsiveFontSizes } from '@mui/material/styles'

// ** Theme Override Imports
import overrides from './overrides'
import typography from './typography'

// ** Theme
import themeOptions from './ThemeOptions'

// ** Global Styles
import GlobalStyling from './globalStyles'

// ** Prismjs Styles
import 'prismjs'
import 'prismjs/themes/prism-tomorrow.css'
import 'prismjs/components/prism-jsx'
import 'prismjs/components/prism-tsx'

import 'react-perfect-scrollbar/dist/css/styles.css';

const APP_BAR_MOBILE = 64;
const APP_BAR_DESKTOP = 92;

const VerticalLayoutWrapper = styled('div')({
	height: '100%',
	display: 'flex'
})

const MainContentWrapper = styled(Box)({
	flexGrow: 1,
	minWidth: 0,
	display: 'flex',
	minHeight: '100vh',
	flexDirection: 'column'
})

const ContentWrapper = styled('main')(({ theme }) => ({
	flexGrow: 1,
	width: '100%',
	padding: theme.spacing(6),
	transition: 'padding .25s ease-in-out',
	[theme.breakpoints.down('sm')]: {
		paddingLeft: theme.spacing(4),
		paddingRight: theme.spacing(4)
	}
}))

const DashboardLayout = () => {
	const [settings, saveSettings] = useState({
		themeColor: "primary",
		mode: "light",
		direction: "ltr",
		appBarBlur: true,
		navCollapsed: false,
		contentWidth: "boxed",
		verticalNavToggleType: "accordion",
		skin: "default",
		appBar: "fixed",
		footer: "static",
		layout: "vertical",
		navHidden: false,
		lastLayout: "vertical",
		toastPosition: "top-right"
	});
	const { navigationSize, disableCustomizer, collapsedNavigationSize } = themeConfig;
	const navWidth = navigationSize
	const navigationBorderWidth = settings.skin === 'bordered' ? 1 : 0;
	const collapsedNavWidth = collapsedNavigationSize
	const [open, setOpen] = useState(false);
	const [navHover, setNavHover] = useState(false)
	const [navVisible, setNavVisible] = useState(false)
	// ** Toggle Functions
	const toggleNavVisibility = () => setNavVisible(!navVisible)
	// ** Merged ThemeOptions of Core and User
	const coreThemeConfig = themeOptions(settings)

	// ** Pass ThemeOptions to CreateTheme Function to create partial theme without component overrides
	let theme = createTheme(coreThemeConfig)

	const hidden = false;
	// const hidden = useMediaQuery(theme => theme.breakpoints.down('lg'))

	// ** Deep Merge Component overrides of core and user
	const mergeComponentOverrides = (theme, settings) =>
		deepmerge({ ...overrides(theme, settings) }, null)

	// ** Deep Merge Typography of core and user
	const mergeTypography = theme => deepmerge(typography(theme), null)

	// ** Continue theme creation and pass merged component overrides to CreateTheme function
	theme = createTheme(theme, {
		components: { ...mergeComponentOverrides(theme, settings) },
		typography: { ...mergeTypography(theme) }
	})

	// ** Set responsive font sizes to true
	if (themeConfig.responsiveFontSizes) {
		theme = responsiveFontSizes(theme)
	}

	return (
		<>
			<ThemeProvider theme={theme}>
				<VerticalLayoutWrapper className='layout-wrapper'>
					<CssBaseline />
					<GlobalStyles styles={() => GlobalStyling(theme, settings)} />
					<MainContentWrapper className='layout-content-wrapper'>
						<AppBar toggleNavVisibility={toggleNavVisibility} settings={settings} />
						<ContentWrapper
							className='layout-page-content'
							sx={{
								...(settings.contentWidth === 'boxed' && {
									mx: 'auto',
									'@media (min-width:1440px)': { maxWidth: 1440 },
									'@media (min-width:1200px)': { maxWidth: '100%' }
								})
							}}
						>
							<Outlet />
						</ContentWrapper>
						<Footer settings={settings} />
					</MainContentWrapper>
				</VerticalLayoutWrapper>
			</ThemeProvider>
		</>
	)
}

export default DashboardLayout;