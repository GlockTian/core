/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL fragment: VideoTriggerFields
// ====================================================

export interface VideoTriggerFields_triggerAction_NavigateAction {
  __typename: "NavigateAction";
  gtmEventName: string | null;
}

export interface VideoTriggerFields_triggerAction_NavigateToBlockAction {
  __typename: "NavigateToBlockAction";
  gtmEventName: string | null;
  blockId: string;
}

export interface VideoTriggerFields_triggerAction_NavigateToJourneyAction_journey {
  __typename: "Journey";
  id: string;
  slug: string;
}

export interface VideoTriggerFields_triggerAction_NavigateToJourneyAction {
  __typename: "NavigateToJourneyAction";
  gtmEventName: string | null;
  journey: VideoTriggerFields_triggerAction_NavigateToJourneyAction_journey | null;
}

export interface VideoTriggerFields_triggerAction_LinkAction {
  __typename: "LinkAction";
  gtmEventName: string | null;
  url: string;
}

export type VideoTriggerFields_triggerAction = VideoTriggerFields_triggerAction_NavigateAction | VideoTriggerFields_triggerAction_NavigateToBlockAction | VideoTriggerFields_triggerAction_NavigateToJourneyAction | VideoTriggerFields_triggerAction_LinkAction;

export interface VideoTriggerFields {
  __typename: "VideoTriggerBlock";
  id: string;
  parentBlockId: string | null;
  /**
   * triggerStart sets the time as to when a video navigates to the next block,
   * this is the number of seconds since the start of the video
   */
  triggerStart: number;
  triggerAction: VideoTriggerFields_triggerAction;
}
