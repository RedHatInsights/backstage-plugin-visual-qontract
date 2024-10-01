import { Link } from "@material-ui/core";
import OpenInNew from "@material-ui/icons/OpenInNew";
import { mdiSlack, mdiGoogle } from '@mdi/js';
import Icon from '@mdi/react';
import React from "react";



export const ExternalCoordinationButton = ({ link }: { link: any }) => {
    // if the link contains meet return a video call icon that acts as a link to a new target with the URL and target set to _blank
    if (link.includes('meet')) {
      return (
        <Link href={link} target="_blank">
          <Icon path={mdiGoogle} size={1} color="currentColor" />
        </Link>
      );
    }
    // if the link contains slack return a chat icon that acts as a link to a new target with the URL and target set to _blank
    if (link.includes('slack')) {
      return (
        <Link href={link} target="_blank">
          <Icon path={mdiSlack} size={1} color="currentColor" />
        </Link>
      );
    }
    // If we're not sure what the link is use the OpenInNew icon that acts as a link to a new target with the URL and target set to _blank
    return (
      <Link href={link} target="_blank">
        <OpenInNew />
      </Link>
    );
  };