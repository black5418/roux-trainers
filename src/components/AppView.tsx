import React from 'react'
import { AppState, Mode, Action } from "../Types";

import { Box, Typography, Button } from '@mui/material';
import makeStyles from '@mui/styles/makeStyles';
import { Dialog, DialogContent, DialogActions } from '@mui/material';
import { Grid, Container } from '@mui/material';

import { CmllTrainerView, OllcpTrainerView } from './CmllTrainerView';
import BlockTrainerView from './BlockTrainerView';
import PanoramaView from './PanoramaView';


import FavListView from './FavListView';
import TopBarView from './TopBarView';
import AnalyzerView from './AnalyzerView';

import Markdown from 'markdown-to-jsx';
import useMediaQuery from '@material-ui/core/useMediaQuery/useMediaQuery';

import { theme } from '../theme';

interface TabPanelProps {
  value: number,
  index: number,
  children: any,
  [key: string]: any
}
function TabPanel(props: TabPanelProps ) {
  const { children, value, index, ...other } = props;

  return (
    <Typography
      component="div"
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && <Box p={0}>{children}</Box>}
    </Typography>
  );
}
const useStyles = makeStyles(theme => ({
  page: {
    backgroundColor: theme.palette.background.default
  },
  container: {
    display: "flex"
  },
  icon: {
    minWidth: 0
  },
  root: {
    display: "flex"
  },
  bar: {
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.background.paper,
    //borderRadius: "5px"
  },
  select: {
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.background.paper,
    borderRadius: 4,
    border: "1px solid " + theme.palette.background.default,
  }
}))

export const tab_modes : [Mode, string, string][] = [
  ["fb", "左桥 (固定朝向)", "左桥 (固定)"],
  ["analyzer", "左桥分析器 (容差/全底色)", "左桥分析器"],
  ["fs", "左桥方形块", "左桥方形块"],
  ["fsdr", "左桥方形块 + 右底棱", "左桥方形块 + 右底棱"],
  ["fbdr", "左桥最后角棱对 (+ 右底棱)", "左桥最后角棱对"],
  ["fbss", "左桥最后角棱对 + 右桥方形块", "左桥角棱对 + 右桥方块"],
  ["ss", "右桥方形块", "右桥方形块"],
  ["cmll", "CMLL (顶层角块)", "CMLL"],
  //TODO: build this ["misc-algs", "OLLCP", "OLLCP"],
  ["4c", "LSE 4c (最后换棱)", "LSE 4c"],
  ["eopair", "EOLR / EOLRb (高阶翻棱与归位)", "EOLR(b)"]
  //["tracking", "Tracking Trainer (Beta)", "Tracking"]
]

function _getInitialHashLocation() {
  const default_idx = tab_modes.findIndex(x => x[0] === "fbdr")
  if (window.location.hash) {
    let idx = tab_modes.findIndex(x => x[0] === window.location.hash.slice(1))
    if (idx === -1) {
      window.location.hash = "";
      return default_idx;
    } else {
      return idx;
    }
  } else {
    return default_idx
  }
}

const introText = `# Onionhoney's Roux Trainers
- A trainer collection that caters to all your Roux training needs  ❤️
- Inspired by http://cubegrass.appspot.com/, but with everything that it is missing.

## Modes supported
- FB analyzer
    - Solves for all x2y FBs, and suggests the best FB to start with!
    - Also suggests the best FS/Pseudo FS/Line to start with!
    - Can be presented as a 'can you find the x-mover' quiz with solution revealed in the spoiler.
    - More orientations supported too (CN, blue/green x2y, red/orange x2y)
- FB last slot (+ DR) trainer
    - \`HIGHLY USEFUL\` if you're learning FB or FB + DR. Get a random scramble, think on your own, and check with our solutions!
    - **Note**: while I try my best, the solver can still miss out on the best overall solution. So please, consult your human fellows when you're unsure, and always be careful with what you choose to learn.
- FS/FB/SS trainer
    - You can specify by piece positions. It seems these modes are pretty useful in providing new insights into blockbuilding  (for us dumb humans).
- CMLL trainer
    - Truly random L10P scrambles so you can't tell the cases. You can specify different OCLLs. You can even start with a random SB last pair (to simulate how real recognition works)
    - Show only the stickers necessary for recognition!
- LSE trainers (EOLR, 4c)
    - Good for reviewing EOLR and practicing your 4c recognition method. You can filter by MC/Non-MC cases too.

## Shortcuts
- Space for the next scramble.
- Enter to reset the virtual cube to current scramble.
- Control your cube with cstimer key mapping.

## Functionalities
- Scrambles are all random state. Solver is Roux-optimized with M and r moves as first-class citizens, with up to 25 different solutions provided.

- You can control the virtual cube with keyboard (CStimer mapping). You can also drag on the cube to change its perspective.

- You can bookmark your favorite cases and these will be saved in your browser.

- You can input your own scrambles as a list and our trainer will drain them one by one!

- Appearance: dark mode enabled.

---

## Version Log
- (v1.0.0) All work prior to 12/02/2020, which I forgot to version log for.
- (v1.0.1) 12/02/2020: Add edge position control for FB Last Pair trainer.
- (v1.1) 12/15/2020: Reworked UI. App bar now features a dropdown menu for selecting the mode. Scramble occupies its own row. Solutions are shown side by side with the sim cube in large screen.
- (v1.2) 12/17/2020: Add support for scramble input for all modes. Now you can paste in a list of scrambles, and the trainer will consume them one by one in order.
- (v1.3) 12/20/2020: Solve Analysis Beta is online! It can do the following:
    - For any random scramble, it'll recommend the best FB solutions over all orientations (e.g. x2y yellow/white).
    - Given a solve reconstruction, it'll analyze each stage, and compare your solution there with the solver-suggested solutions.
- (v1.4) 12/23/2020: Refine the appearance of the virtual cube and enable camera control with mouse dragging.
- (v1.5) 2/18/2021: Introduced Tracking Trainer Beta.
- Refer to Github page for the full version log: https://github.com/onionhoney/roux-trainers

---

If you have ideas on how to improve the app just shoot a message and let me know. <3
`

const zhIntroText = `# Onionhoney 的 Roux 训练器
- 一个覆盖 Roux 训练需求的训练器集合。
- 灵感来自 http://cubegrass.appspot.com/，并补上了它缺少的许多功能。

## 支持的模式
- 左桥分析器
    - 求解所有 x2y FB，并推荐最适合作为开局的 FB。
    - 同时推荐最佳 FS / 伪 FS / Line 开局。
    - 可以作为“你能找到 x 步解吗”的小测验显示，答案点击后揭晓。
    - 支持更多朝向：CN、蓝/绿 x2y、红/橙 x2y。
- 左桥最后角棱对 (+ 右底棱) 训练器
    - 如果你正在练 FB 或 FB + DR，这个模式非常有用。拿一个随机打乱，先自己思考，再对照程序给出的解法。
    - **注意**：求解器会尽力寻找好解，但仍可能漏掉整体最优解。拿不准时请和真人玩家交流，谨慎选择要练习的解法。
- 左桥 / 右桥方形块训练器
    - 可以按块位置指定 case，适合用来观察和理解搭块。
- CMLL (顶层角块) 训练器
    - 使用真正随机的 L10P 打乱，因此不能靠打乱判断 case。你可以指定 OCLL，也可以从随机右桥最后角棱对开始，模拟真实识别。
    - 可以只显示识别所需的贴纸。
- LSE 训练器 (EOLR, 4c)
    - 适合复习 EOLR 和练习 4c 识别方法，也可以按 MC / Non-MC case 过滤。

## 快捷键
- 空格：下一组打乱。
- Enter：将虚拟魔方重置为当前打乱。
- 使用 cstimer 键位控制虚拟魔方。

## 功能
- 打乱均为随机状态。求解器针对 Roux 优化，将 M 和 r 转动作为一等公民处理，最多提供 25 条不同解法。
- 可以用键盘控制虚拟魔方，也可以拖拽魔方改变观察角度。
- 可以收藏喜欢的 case，收藏会保存在浏览器中。
- 可以输入自己的打乱列表，训练器会按顺序逐条使用。
- 外观支持暗色模式。

---

## 版本日志
- 此处只显示简要日志，完整版本日志请查看 GitHub 页面：https://github.com/onionhoney/roux-trainers

---

如果你有改进建议，欢迎联系作者。
`

function Intro() {
  return <Markdown>{zhIntroText || introText}</Markdown>
}

// TODO: Write getter and setter for config items, and also write handlers that map to setters
function AppView(props: { state: AppState, dispatch: React.Dispatch<Action> } ) {
  //const [locations, setLocations] = React.useState([])
  let { state, dispatch } = props
  let classes = useStyles()

  const handleChange = React.useCallback( (newValue:number) => {
    if (newValue < tab_modes.length) {
      setValue(newValue)
      let mode = tab_modes[newValue][0]
      dispatch({type: "mode", content: mode})
    }
  }, [dispatch])

  const [ open, setOpen ] = React.useState(false)

  const [value, setValue] = React.useState(_getInitialHashLocation());
  React.useEffect( () => {
    dispatch({type: "mode", content: tab_modes[_getInitialHashLocation()][0]})
  }, [dispatch])

  const handleInfoOpen = () => { setOpen(true) }
  const handleInfoClose = () => { setOpen(false) }

  const toggleBright = () => {
    const theme_flag = [...state.config.theme.flags]
    theme_flag[0] = 1 - theme_flag[0]
    theme_flag[1] = 1 - theme_flag[1]
    dispatch({ type: "config", content: {
      theme: state.config.theme.setFlags(theme_flag)
    }})
  }
  const toggleFav = () => {
    setFav(!showFav)
  }

  const [ showFav, setFav ] = React.useState(false)
  const createTabPanels = (elements: any[]) => {
    return <React.Fragment>
    {
      elements.map( (el, i) => <TabPanel key={i} value={value} index={i} className={classes.page}>{el}</TabPanel>)
    }
    </React.Fragment>
  }
  return (
    <main>
      <Dialog open={open} onClose={handleInfoClose} >
      <DialogContent dividers>
        <Intro></Intro>
      </DialogContent>
      <DialogActions>
        <Button color="primary" onClick={handleInfoClose}>
          知道了
        </Button>
      </DialogActions>
      </Dialog>

      <TopBarView onChange={handleChange} value={value}
        handleInfoOpen={handleInfoOpen} toggleBright={toggleBright} toggleFav={toggleFav}
      />

      <Box paddingY={2} paddingX={0}>
      <Container maxWidth={showFav ? "lg" : "md" }>

      {
      value === -1?
      (
      <Grid container className={classes.container} spacing={3}>
        <Grid item md={12} sm={12} xs={12}>
        <TabPanel value={value} index={4} className={classes.page}>
          <PanoramaView {...{state, dispatch}} />
        </TabPanel>
        </Grid>
      </Grid>
      )
      :
      (
      <Grid container className={classes.container} spacing={ 3}>
        <Grid item hidden={!showFav} md={4} sm={4} xs={12} >
        <FavListView {...{state, dispatch}} />
        </Grid>

        <Grid item md={showFav ? 8 : 12} sm={showFav ? 8 : 12} xs={12}>
        {
          createTabPanels([
            <BlockTrainerView {...{state, dispatch}} />, // fb
            <AnalyzerView {...{state, dispatch}} />,
            <BlockTrainerView {...{state, dispatch}} />, // fs
            <BlockTrainerView {...{state, dispatch}} />, // fsdr
            <BlockTrainerView {...{state, dispatch}} />, // fbdr
            <BlockTrainerView {...{state, dispatch}} />, // fbss
            <BlockTrainerView {...{state, dispatch}} />, // ss
            <CmllTrainerView {...{state, dispatch}} />,
            // <OllcpTrainerView {...{state, dispatch}} />,
            <BlockTrainerView {...{state, dispatch}} />,
            <BlockTrainerView {...{state, dispatch}} />,
            /*<TrackerView {...{state, dispatch}} /> */
          ])
        }

        </Grid>
      </Grid>
      )
      }
      </Container></Box>
    </main>
  )
}
export default AppView
