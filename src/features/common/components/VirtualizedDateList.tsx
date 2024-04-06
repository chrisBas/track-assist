import { Typography } from "@mui/material";
import Box from "@mui/material/Box";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
import { Dayjs } from "dayjs";
import { useEffect, useRef, useState } from "react";
import { FixedSizeList, ListChildComponentProps } from "react-window";
import InfiniteLoader from "react-window-infinite-loader";
import { useDimensions } from "../hooks/useDimensions";

const LOADING = 1;
const LOADED = 2;
let itemStatusMap: Record<number, number> = {};
const RANGE = 100;

const isItemLoaded = (index: number) => !!itemStatusMap[index];

type Props = {
  date: Dayjs;
  onDateChange: (date: Dayjs) => void;
};

/**
 * This is a neat component; but there is a bug if you select new dates several times, it will start misbehaving
 *
 * @param param0
 * @returns
 */
export default function VirtualizedDateList({
  date: initDate,
  onDateChange,
}: Props) {
  const virtualLoaderRef = useRef(null);
  const ref = useRef(null);
  const { width } = useDimensions(ref);
  const itemSize = width / 5;
  const [positiveCount, setPositiveCount] = useState(RANGE); // includes zero
  const [negativeCount, setNegativeCount] = useState(RANGE - 1);
  const count = positiveCount + negativeCount;
  const zeroIdx = negativeCount + 1;
  // the reason for (zeroIdx - 2) is to center the list on the zero index (initDate)
  const initialScrollOffset = (zeroIdx - 2) * itemSize;

  useEffect(() => {
    (virtualLoaderRef.current as any)?._listRef.scrollTo(initialScrollOffset);
  }, [initDate, initialScrollOffset]);

  const loadMoreItems = (startIndex: number, stopIndex: number) => {
    if (stopIndex > count - RANGE / 2) {
      setPositiveCount(positiveCount + RANGE);
    } else if (startIndex < RANGE / 2) {
      setNegativeCount(negativeCount + RANGE);
    }
    for (let index = startIndex; index <= stopIndex; index++) {
      itemStatusMap[index] = LOADING;
    }
    return new Promise<void>((resolve) =>
      setTimeout(() => {
        for (let index = startIndex; index <= stopIndex; index++) {
          itemStatusMap[index] = LOADED;
        }
        resolve();
      }, 0)
    );
  };

  function renderRow(props: ListChildComponentProps) {
    const { index, style } = props;
    const isSelected = zeroIdx === index;
    let label;
    let subLabel = undefined;
    if (itemStatusMap[index] === LOADED) {
      const dayOffset = index - zeroIdx;
      const date = initDate.add(dayOffset, "day");
      label = date.format("DD");
      subLabel = date.format("ddd").toUpperCase();
    } else {
      label = "Loading...";
    }

    return (
      <ListItem style={style} key={index} component="div" disablePadding>
        <ListItemButton
          onClick={() => {
            const dayOffset = index - zeroIdx;
            const date = initDate.add(dayOffset, "day");
            onDateChange(date);
          }}
          sx={{
            px: 1,
          }}
        >
          <ListItemText
            sx={{ textAlign: "center" }}
            primary={
              <Typography
                variant="caption"
                color={isSelected ? "primary" : "gray"}
              >
                {subLabel}
              </Typography>
            }
            secondaryTypographyProps={{ component: "div" }}
            secondary={
              <Box
                sx={{
                  height: "30px",
                  width: "30px",
                  color: isSelected ? "primary.contrastText" : undefined,
                  bgcolor: isSelected ? "primary.main" : undefined,
                  borderRadius: "15px",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  margin: "auto",
                }}
              >
                <Typography variant="body2" fontWeight="bold">
                  {label}
                </Typography>
              </Box>
            }
          />
        </ListItemButton>
      </ListItem>
    );
  }

  return (
    <Box
      ref={ref}
      sx={{
        width: "100%",
        bgcolor: "background.paper",
      }}
    >
      {width > 0 && (
        <InfiniteLoader
          ref={virtualLoaderRef}
          isItemLoaded={isItemLoaded}
          itemCount={count}
          loadMoreItems={loadMoreItems}
        >
          {({ onItemsRendered, ref }) => (
            <FixedSizeList
              height={82}
              width={width}
              itemSize={itemSize}
              itemCount={count}
              overscanCount={5}
              initialScrollOffset={initialScrollOffset}
              layout="horizontal"
              onItemsRendered={onItemsRendered}
              ref={ref}
            >
              {renderRow}
            </FixedSizeList>
          )}
        </InfiniteLoader>
      )}
    </Box>
  );
}
