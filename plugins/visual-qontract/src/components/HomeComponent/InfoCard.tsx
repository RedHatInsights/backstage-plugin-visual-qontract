import {
  Card,
  CardHeader,
  CardContent,
  Typography,
  CardActions,
  Link,
  makeStyles,
} from '@material-ui/core';
import OpenInNew from '@material-ui/icons/OpenInNew';
import React, { ReactNode } from 'react';

export const InfoCard = ({
  title,
  avatar,
  body,
  link,
  linkText,
}: {
  title: string;
  avatar: React.ReactNode;
  body: string;
  link: string;
  linkText?: string;
}) => {
  const useStyles = makeStyles({
    topcard: {
      minHeight: '16em',
      flex: '0 0 auto',
    },
  });
  const classes = useStyles();
  return (
    <Card classes={{ root: classes.topcard }}>
      <CardHeader
        title={title}
        avatar={avatar}
        titleTypographyProps={{
          variant: 'h6',
        }}
      />
      <CardContent>
        <Typography variant="body1">{body}</Typography>
      </CardContent>
      <CardActions>
        <OpenInNew />
        <Link href={link}>
          <Typography variant="button">{linkText}</Typography>
        </Link>
      </CardActions>
    </Card>
  );
};
