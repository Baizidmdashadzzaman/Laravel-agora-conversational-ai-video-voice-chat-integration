import * as GroupTypes from '../types/groupApi';
import { AsyncResult, UserId, CommonRequestResult } from '../types/common';
export interface GroupApi {
	/**
	 * Creates a group instance.
	 *
	 * ```typescript
	 * connection.createGroup({
	 *  data: {
	 *      groupname: 'groupname',
	 *      desc: 'this is my group',
	 *      members: ['user1', 'user2'],
	 *      public: true,
	 *      approval: false,
	 *      allowinvites: true,
	 *      inviteNeedConfirm: false
	 *  }
	 *  })
	 * ```
	 */
	createGroup(params: {
		/** The group information. */
		data: {
			/** The group name. */
			groupname: string;
			/** The description of the group. */
			desc: string;
			/** The array of member IDs to add to the group. These users will be added directly into the group and receive "operation: 'directJoined'" in the callback of onGroupEvent. */
			members: UserId[];
			/** Whether it is a public group. -`true`: Yes; -`false`: No. Public group: the group that others can query by calling `listgroups`. */
			public: boolean;
			/** Whether a user requires the approval from the group admin to join the group. -`true`: Yes; -`false`: No.*/
			approval: boolean;
			/** Whether to allow group members to invite others to the group. `true`: Allow; `false`: Do not allow.*/
			allowinvites: boolean;
			/** Whether the invitee needs to accept the invitation before joining the group.
			- `true`: The invitee's consent is required. The default value is `true`.
			- `false`: The invitee will be directly added to the group without confirmation.
			*/
			inviteNeedConfirm: boolean;
			/** The group max users. */
			maxusers: number;
			/** Group detail extensions which can be in the JSON format to contain more group information. */
			ext?: string;
		};
	}): Promise<AsyncResult<GroupTypes.CreateGroupResult>>;

	/**
	 * Blocks group messages. This method is only valid for mobile devices.
	 * ```typescript
	 * connection.blockGroupMessages({groupId: 'groupId'})
	 * ```
	 */
	blockGroupMessages(params: {
		/** The group ID. */
		groupId: string;
	}): Promise<AsyncResult<GroupTypes.BlockGroupResult>>;

	/**
	 * Gets public groups with pagination.
	 *
	 * ```typescript
	 * connection.getPublicGroups({limit: 20, cursor: null})
	 * ```
	 */
	getPublicGroups(params: {
		/** The number of records per page. */
		limit: number;
		/** The cursor that specifies where to start to get data. If there will be data on the next page, this method will return the value of this field to indicate the position to start to get data of the next page. If it is null, the data of the first page will be fetched.*/
		cursor?: string;
	}): Promise<AsyncResult<GroupTypes.BaseGroupInfo[]>>;

	/**
	 * Lists all the groups a user has joined.
	 *
	 * @note
	 * If either `needAffiliations` or `needRole` is set `true`, when you get data with pagination, the current page number (pageNum) starts from 0 and you can get a maximum of 20 groups (pageSize) on each page and
	 * the function return type is `Promise<AsyncResult<GroupTypes.GroupInfo[]>`
	 *
	 * If neither of the parameters is set, when you get data with pagination, the current page number (pageNum) starts from 1 and you can get a maximum of 500 groups (pageSize) on each page and and
	 * the function return type is `Promise<AsyncResult<GroupTypes.BaseGroupInfo[]>`
	 *
	 * ```typescript
	 * connection.getJoinedGroups({
	 * 		pageNum: 1,
	 * 		pageSize: 500,
	 * 		needAffiliations: false,
	 * 		needRole: false
	 * })
	 * ```
	 */
	getJoinedGroups(params: {
		/**
		 * If either `needAffiliations` or `needRole` is set, when you get data with pagination, the current page number (pageNum) starts from 0.
		 *
		 * If neither of the parameters is set, when you get data with pagination, the current page number (pageNum) starts from 1.
		 * */
		pageNum: number;
		/**
		 * If either `needAffiliations` or `needRole` is set, when you get data with pagination, you can get a maximum of 20 groups (pageSize) on each page.
		 *
		 * If neither of the parameters is set, when you get data with pagination, you can get a maximum of 500 groups (pageSize) on each page.
		 * */
		pageSize: number;
		/** Whether the number of group members is required.
		 * `true`: Yes;
		 * （Default）`false`: No.
		 */
		needAffiliations?: boolean;
		/** Whether the role of the current user in the group is required.
		 * `true`: Yes;
		 * （Default）`false`: No.
		 */
		needRole?: boolean;
		success?: (
			res: AsyncResult<
				GroupTypes.BaseGroupInfo[] | GroupTypes.GroupInfo[]
			>
		) => void;
		error?: (error: ErrorEvent) => void;
	}): Promise<
		AsyncResult<GroupTypes.BaseGroupInfo[] | GroupTypes.GroupInfo[]>
	>;

	/**
	 * Transfers a group. Only the group owner can call this method. Group members will receive "operation: 'changeOwner'" in the callback of onGroupEvent.
	 *
	 * ```typescript
	 * connection.changeGroupOwner({groupId: 'groupId', newOwner: 'user1'})
	 * ```
	 */
	changeGroupOwner(params: {
		/** The group ID. */
		groupId: string;
		/** The new group owner. */
		newOwner: UserId;
	}): Promise<AsyncResult<GroupTypes.ChangeGroupOwnerResult>>;

	/**
	 * Gets specifications of the group.
	 * ```typescript
	 * connection.getGroupInfo({groupId: groupId})
	 * ```
	 */
	getGroupInfo(params: {
		/** The group ID or group ID list. */
		groupId: string | string[];
	}): Promise<AsyncResult<GroupTypes.GroupDetailInfo[]>>;

	/**
	 * Modifies group information. Only the group admin can call this method.
	 *
	 * ```typescript
	 * connection.modifyGroup({groupId: 'groupId', groupName: 'groupName', description:'description'})
	 * ```
	 */
	modifyGroup(params: {
		/** The Group ID. */
		groupId: string;
		/** The group name. */
		groupName: string;
		/** The group description. */
		description: string;
		/** Group detail extensions which can be in the JSON format to contain more group information. */
		ext?: string;
	}): Promise<AsyncResult<GroupTypes.ModifyGroupResult>>;

	/**
	 * Lists all members of the group with pagination.
	 *
	 * ```typescript
	 * connection.listGroupMembers({pageNum: 1, pageSize: 20, groupId: 'groupId'})
	 * ```
	 */
	listGroupMembers(params: {
		/** The group ID。 */
		groupId: string;
		/** The page number, starting from 1. */
		pageNum: number;
		/** The number of members per page. The value cannot exceed 1000. */
		pageSize: number;
	}): Promise<AsyncResult<GroupTypes.GroupMember[]>>;

	/**
	 * Gets all admins in the group.
	 * ```typescript
	 * connection.getGroupAdmin({groupId: 'groupId'})
	 * ```
	 *
	 */
	getGroupAdmin(params: {
		/** The group ID。 */
		groupId: string;
	}): Promise<AsyncResult<UserId[]>>;

	/**
	 * Sets a group admin. Only the group owner can call this method. The user set as an admin will receive "operation: 'setAdmin'" in the callback of onGroupEvent.
	 *
	 * ```typescript
	 * connection.setGroupAdmin({groupId: 'groupId', username: 'user1'})
	 * ```
	 */
	setGroupAdmin(params: {
		/** The group ID. */
		groupId: string;
		/** The ID of the user set as admin. */
		username: UserId;
	}): Promise<AsyncResult<GroupTypes.SetGroupAdminResult>>;

	/**
	 * Removes a group admin. Only the group owner can call this method. The user whose admin permissions are revoked will receive "operation: 'removeAdmin'" in the callback of onGroupEvent.
	 *
	 * ```typescript
	 * connection.removeGroupAdmin({groupId: 'groupId', username: 'user1'})
	 * ```
	 */
	removeGroupAdmin(params: {
		/** The group ID. */
		groupId: string;
		/** The ID of the user with admin privileges revoked. */
		username: string;
	}): Promise<AsyncResult<GroupTypes.RemoveGroupAdminResult>>;

	/**
	 * Destroys a group. Only the group owner can call this method. Group members will receive "operation: 'destroy'" in the callback of onGroupEvent.
	 *
	 * ```typescript
	 * connection.destroyGroup({groupId: 'groupId'})
	 * ```
	 */
	destroyGroup(params: {
		/** The group id. */
		groupId: string;
	}): Promise<AsyncResult<GroupTypes.DestroyGroupResult>>;

	/**
	 * Leaves the group. Group members will receive "operation: 'memberAbsence'" in the callback of onGroupEvent.
	 *
	 * ```typescript
	 * connection.leaveGroup({groupId: 'groupId'})
	 * ```
	 */
	leaveGroup(params: {
		/** The group ID. */
		groupId: string;
	}): Promise<
		AsyncResult<{
			result: true;
		}>
	>;

	/**
	 * Invites users into a group.
	 * Creates a group instance "inviteNeedConfirm:true", the invited users will receive "operation: 'inviteToJoin'" in the callback of onGroupEvent.
	 * Creates a group instance "inviteNeedConfirm:false", the invited users will receive "operation: 'directJoined'" in the callback of onGroupEvent.
	 *
	 * ```typescript
	 * connection.inviteUsersToGroup({groupId: 'groupId', users: ['user1', 'user2']})
	 * ```
	 */

	inviteUsersToGroup(params: {
		/** The group ID. */
		groupId: string;
		/** The array of invitee IDs. */
		users: UserId[];
	}): Promise<AsyncResult<GroupTypes.InviteUsersToGroupResult[]>>;

	/**
	 * Applies to join the group. The group owner and admin will receive "operation: 'requestToJoin'" in the callback of onGroupEvent.
	 *
	 * ```typescript
	 * connection.joinGroup({groupId: 'groupId', message: 'I want to join the group'})
	 * ```
	 *
	 */

	joinGroup(params: {
		/** The group ID. */
		groupId: string;
		/** The additional information of the request. */
		message: string;
	}): Promise<AsyncResult<CommonRequestResult>>;

	/**
	 * Accepts a group request. Only the group owner or admin can call this method. The user joining the group will receive "operation: 'acceptRequest'" in the callback of onGroupEvent.
	 *
	 * ```typescript
	 * connection.acceptGroupJoinRequest({applicant: 'user1', groupId: 'groupId'})
	 * ```
	 */
	acceptGroupJoinRequest(params: {
		/** The ID of the user requesting to join the group. */
		applicant: UserId;
		/** The group ID. */
		groupId: string;
	}): Promise<AsyncResult<CommonRequestResult>>;

	/**
	 * Declines a group request. Only the group owner or admin can call this method.
	 *
	 * ```typescript
	 * connection.rejectGroupJoinRequest({applicant: 'user1', groupId: 'groupId', reason: 'I do not like you'})
	 * ```
	 */
	rejectGroupJoinRequest(params: {
		/** The ID of the user who sends the request to join the group. */
		applicant: UserId;
		/** The group ID. */
		groupId: string;
		/** The reason of declining. */
		reason: string;
	}): Promise<AsyncResult<CommonRequestResult>>;

	/**
	 * Accepts a group invitation. If a group member invites a user to join the group, the invitee can call this method to accept the invitation. The inviter will receive "operation: 'acceptInvite'" in the callback of onGroupEvent. The user who joins the group successfully will receive "operation: 'memberPresence'" in the callback of onGroupEvent.
	 *
	 * ```typescript
	 * connection.acceptGroupInvite({invitee: 'myUserId', groupId: 'groupId'})
	 * ```
	 */
	acceptGroupInvite(params: {
		/** The user ID of the invitee. */
		invitee: UserId;
		/** The group ID. */
		groupId: string;
	}): Promise<AsyncResult<CommonRequestResult>>;

	/**
	 * Declines a group invitation. If a group member invites a user to join a group, the invitee can call this method to decline the invitation.
	 *
	 * ```typescript
	 * connection.rejectGroupInvite({invitee: 'myUserId', groupId: 'groupId'})
	 * ```
	 */
	rejectGroupInvite(params: {
		/** The user ID of the invitee. */
		invitee: UserId;
		/** The group ID. */
		groupId: string;
	}): Promise<AsyncResult<CommonRequestResult>>;

	/**
	 * Removes a member from the group. Only the group owner or admin can call this method. The removed member will receive "operation: 'removeMember' in the callback of onGroupEvent, and other group members will receive "operation: 'memberAbsence' in the callback of onGroupEvent.
	 *
	 * ```typescript
	 * connection.removeGroupMember({groupId: 'groupId', username: 'user1'})
	 * ```
	 */
	removeGroupMember(params: {
		/** The group ID. */
		groupId: string;
		/** The member ID to remove. */
		username: UserId;
	}): Promise<AsyncResult<GroupTypes.RemoveGroupMemberResult>>;

	/**
	 *  Removes members from the group. Only the group owner or admin can call this method. The removed members will receive "operation: 'removeMember'" in the callback of onGroupEvent, and other group members will receive "operation: 'memberAbsence' in the callback of onGroupEvent.
	 *
	 * ```typescript
	 * connection.removeGroupMembers({groupId: 'groupId', users: ['user1', 'user2']})
	 * ```
	 */
	removeGroupMembers(params: {
		/** The group ID. */
		groupId: string;
		/** The array of member IDs to remove. */
		users: UserId[];
	}): Promise<AsyncResult<GroupTypes.RemoveGroupMemberResult[]>>;

	/**
	 * Mutes a group member. Only the group owner or admin can call this method. The muted member and other members will receive "operation:'muteMember'" in the callback of onGroupEvent.
	 *
	 * ```typescript
	 * connection.muteGroupMember({username: 'user1', muteDuration: -1, groupId: 'groupId'})
	 * ```
	 */
	muteGroupMember(params: {
		/** The ID of the group member to mute. */
		username: UserId;
		/** The mute duration in milliseconds. The value `-1` indicates that the member is muted permanently.*/
		muteDuration: number;
		/** The group ID. */
		groupId: string;
	}): Promise<AsyncResult<GroupTypes.MuteGroupMemberResult[]>>;

	/**
	 * Unmute a group member. Only the group owner or admin can call this method. All members, including the muted, will receive "operation: 'unmuteMember'" in the callback of onGroupEvent.
	 *
	 * ```typescript
	 * connection.unmuteGroupMember({groupId: 'groupId', username: 'user1'})
	 * ```
	 */
	unmuteGroupMember(params: {
		/** The group ID. */
		groupId: string;
		/** The group member ID to unmute. */
		username: UserId;
	}): Promise<AsyncResult<GroupTypes.UnmuteGroupMemberResult[]>>;

	/**
	 * Gets the mute list of the group.
	 * Only the group admin or above can call this method.
	 * ```typescript
	 * connection.getGroupMutelist({groupId: 'groupId'})
	 * ```
	 */
	getGroupMutelist(params: {
		/** The group ID. */
		groupId: string;
	}): Promise<AsyncResult<GroupTypes.GetGroupMuteListResult[]>>;

	/**
	 * Adds a member to the group blocklist. Only the group owner or admin can call this method. The member added to the blocklist will receive "operation: 'removeMember'" in the callback of onGroupEvent.
	 *
	 * ```typescript
	 * connection.blockGroupMember({groupId: 'groupId', username: 'user1'})
	 * ```
	 */
	blockGroupMember(params: {
		/** The group ID. */
		groupId: string;
		/** User ID to be added to the blocklist. */
		username: UserId;
	}): Promise<AsyncResult<GroupTypes.GroupRequestResult>>;

	/**
	 * Adds members to the group blocklist in bulk. Only the group admin can call this method. Members added to the blocklist will receive "operation: 'removeMember'" in the callback of onGroupEvent.
	 *
	 * ```typescript
	 * connection.blockGroupMembers({usernames: ['user1', 'user2'], groupId: 'groupId'})
	 * ```
	 */
	blockGroupMembers(params: {
		/** The group ID. */
		groupId: string;
		/** The array of member's user IDs to be added to the blocklist. */
		usernames: UserId[];
	}): Promise<AsyncResult<GroupTypes.GroupRequestResult[]>>;

	/**
	 * Removes a member from the group blocklist. Only the group admin can call this method. Members who have been removed from the blocklist will receive "operation: 'unblockMember'" in the callback of onGroupEvent.
	 *
	 * ```typescript
	 * connection.unblockGroupMember({groupId: 'groupId', username: 'user'})
	 * ```
	 */
	unblockGroupMember(params: {
		/** The group ID. */
		groupId: string;
		/** The user ID of the member to be removed from the blocklist. */
		username: string;
	}): Promise<AsyncResult<GroupTypes.GroupRequestResult>>;

	/**
	 * Removes members from the group blocklist in bulk. Only the group owner or admin can call this method. Members who are removed from the blocklist will receive "operation: 'unblockMember'" in the callback of onGroupEvent.
	 *
	 * ```typescript
	 * connection.unblockGroupMembers({groupId: 'groupId', usernames: ['user1', 'user2']})
	 * ```
	 */
	unblockGroupMembers(params: {
		/** The group ID. */
		groupId: string;
		/** The array of members‘ user IDs to be removed from the group blocklist. */
		usernames: UserId[];
	}): Promise<AsyncResult<GroupTypes.GroupRequestResult[]>>;

	/**
	 * Gets the group blocklist.
	 *
	 * ```typescript
	 * connection.getGroupBlocklist({groupId: 'groupId'})
	 * ```
	 */
	getGroupBlocklist(params: {
		/** The group ID. */
		groupId: string;
	}): Promise<AsyncResult<UserId[]>>;

	/**
	 * Mutes all members. Only the group admin or above can call this method. Group members will receive "operation: 'muteAllMembers'" in the callback of onGroupEvent.
	 *
	 * ```typescript
	 *  connection.disableSendGroupMsg({groupId: 'groupId'})
	 * ```
	 */
	disableSendGroupMsg(params: {
		/** The group ID. */
		groupId: string;
	}): Promise<
		AsyncResult<{
			mute: true;
		}>
	>;

	/**
	 * Unmute all members. Only the group admin or above can call this method. Group members will receive "operation: 'unmuteAllMembers'" in the callback of onGroupEvent.
	 *
	 * ```typescript
	 * connection.enableSendGroupMsg({groupId: 'groupId'})
	 * ```
	 */
	enableSendGroupMsg(params: {
		/** The group ID. */
		groupId: string;
	}): Promise<
		AsyncResult<{
			mute: false;
		}>
	>;

	/**
	 * Adds members to the group allowlist. Members on the allowlist can still post messages even if they are muted in the group. Only the group admin or above can call this method. Members added to the allowlist will receive "operation: 'addUserToAllowlist'" in the callback of onGroupEvent.
	 *
	 * ```typescript
	 * connection.addUsersToGroupAllowlist({groupId: 'groupId'})
	 * ```
	 */
	addUsersToGroupAllowlist(params: {
		/** The group ID. */
		groupId: string;
		/** An array of member IDs to be added to the allowlist. */
		users: UserId[];
	}): Promise<AsyncResult<GroupTypes.GroupRequestResult[]>>;

	/**
	 * Removes a member from the group allowlist. Only the group admin or above can call this method. The user that is removed from the group allowlist will receive "operation:'removeAllowlistMember'" in the callback of onGroupEvent.
	 *
	 * ```typescript
	 * connection.removeGroupAllowlistMember({groupId: 'groupId', userName: 'user1'})
	 * ```
	 */
	removeGroupAllowlistMember(params: {
		/** The group ID. */
		groupId: string;
		/** The ID of the member to be removed from the group allowlist. */
		userName: UserId;
	}): Promise<AsyncResult<GroupTypes.GroupRequestResult>>;

	/**
	 * Gets the group allowlist. Only the group admin or above can call this method.
	 *
	 * ```typescript
	 * connection.getGroupAllowlist({groupId: 'groupId'})
	 * ```
	 */
	getGroupAllowlist(params: {
		/** The group ID. */
		groupId: string;
	}): Promise<AsyncResult<UserId[]>>;

	/**
	 * Checks whether the current member is on the allowlist. The app admin can check all users; app users can only check themselves.
	 *
	 * ```typescript
	 * connection.isInGroupAllowlist({groupId: 'groupId', userName: 'user1'})
	 * ```
	 */
	isInGroupAllowlist(params: {
		/** The group ID. */
		groupId: string;
		/** The user ID to query. */
		userName: UserId;
	}): Promise<AsyncResult<GroupTypes.IsInGroupWhiteListResult>>;

	/**
	 * Checks which members have read group message. This is a [value-added function] and .
	 *
	 * ```typescript
	 * connection.getGroupMsgReadUser({groupId: 'groupId', msgId: 'msgId'})
	 * ```
	 */
	getGroupMsgReadUser(params: {
		/** The group ID. */
		groupId: string;
		/** The ID of message to query. */
		msgId: string;
	}): Promise<AsyncResult<GroupTypes.GetGroupMsgReadUserResult>>;

	/**
	 * Gets the group announcement.
	 *
	 * ```typescript
	 * connection.fetchGroupAnnouncement({groupId: 'groupId'})
	 * ```
	 */
	fetchGroupAnnouncement(params: {
		/** The group ID. */
		groupId: string;
	}): Promise<
		AsyncResult<{
			/** The group announcement. */
			announcement: string;
		}>
	>;

	/**
	 * Updates the group announcement.
	 *
	 * ```typescript
	 * connection.updateGroupAnnouncement({groupId: 'groupId', announcement: 'hello'})
	 * ```
	 */
	updateGroupAnnouncement(params: {
		/** The group ID. */
		groupId: string;
		/** The group announcement. */
		announcement: string;
	}): Promise<AsyncResult<GroupTypes.UpdateGroupAnnouncementResult>>;

	/**
	 * Uploads shared files to the group.
	 *
	 * ```typescript
	 * connection.uploadGroupSharedFile({groupId: 'groupId', file: 'file object', onFileUploadProgress: onFileUploadProgress, onFileUploadComplete: onFileUploadComplete,onFileUploadError:onFileUploadError,onFileUploadCanceled:onFileUploadCanceled})
	 * ```
	 */
	uploadGroupSharedFile(params: {
		/** The group ID. */
		groupId: string;
		/** The shared file object to upload. */
		file: object;
		/** The upload progress callback. */
		onFileUploadProgress?: (data: ProgressEvent) => void;
		/** The upload completion callback. */
		onFileUploadComplete?: (data: any) => void;
		/** The upload failure callback. */
		onFileUploadError?: (data: any) => void;
		/** The upload cancellation callback. */
		onFileUploadCanceled?: (data: any) => void;
	}): void;

	/**
	 * Deletes shared files of the group.
	 *
	 * ```typescript
	 * connection.deleteGroupSharedFile({groupId: 'groupId', fileId: 'fileId'})
	 * ```
	 */
	deleteGroupSharedFile(params: {
		/** The group ID. */
		groupId: string;
		/** The shared file ID. */
		fileId: string;
	}): Promise<AsyncResult<GroupTypes.DeleteGroupSharedFileResult>>;

	/**
	 * Gets a list of shared files in the group.
	 *
	 * ```typescript
	 * connection.getGroupSharedFilelist({groupId: 'groupId'})
	 * ```
	 */
	getGroupSharedFilelist(params: {
		/** The group ID. */
		groupId: string;
		/** The page number, starting from 1. */
		pageNum: number;
		/** The number of members per page. The value cannot exceed 10. */
		pageSize: number;
	}): Promise<AsyncResult<GroupTypes.FetchGroupSharedFileListResult>>;

	/**
	 * Down load group file.
	 * ```typescript
	 * connection.downloadGroupSharedFile({groupId: 'groupId', fileId: 'fileId', onFileDownloadComplete: (data)=>{console.log(data)}})
	 * ```
	 */
	downloadGroupSharedFile(params: {
		/** The group ID. */
		groupId: string;
		/** The shared file ID. */
		fileId: string;
		/** The secret key required to download the file. */
		secret?: string;
		onFileDownloadComplete?: (data: Blob) => void;
		onFileDownloadError?: (err: ErrorEvent) => void;
	}): void;

	/**
	 * Check whether you are on the group mute list.
	 *
	 * ```typescript
	 * connection.isInGroupMutelist({groupId: 'groupId'})
	 * ```
	 */
	isInGroupMutelist(params: {
		/** The group ID. */
		groupId: string;
	}): Promise<AsyncResult<boolean>>;

	/**
	 * Sets custom attributes of a group member.
	 * After custom attributes of a group member are set, other members in the group receive the `operation: 'memberAttributesUpdate'`  in the `onGroupEvent` callback and the other devices of the group member receive the  the `operation: 'memberAttributesUpdate'`  in the `onMultiDeviceEvent` callback.
	 *
	 * ```typescript
	 * connection.setGroupMemberAttributes({groupId: 'groupId', userId: 'userId', memberAttributes: {key: 'value'}})
	 * ```
	 */
	setGroupMemberAttributes(params: {
		/** The group ID. */
		groupId: string;
		/** The user ID of the group member. */
		userId: string;
		/**
		 * The custom attributes to set in key-value format. In a key-value pair, if the value is set to an empty string, the custom attribute will be deleted.
		 */
		memberAttributes: GroupTypes.MemberAttributes;
	}): Promise<void>;

	/**
	 * Gets all custom attributes of a group member.
	 * ```typescript
	 * connection.getGroupMemberAttributes({groupId: 'groupId', userId: 'userId'})
	 * ```
	 */
	getGroupMemberAttributes(params: {
		/** The group ID. */
		groupId: string;
		/** The user ID of the group member. */
		userId: string;
	}): Promise<AsyncResult<GroupTypes.MemberAttributes>>;

	/**
	 * Gets custom attributes of multiple group members by attribute key.
	 * ```typescript
	 * connection.getGroupMembersAttributes({groupId: 'groupId', userIds: ['userId'], keys: ['avatar', 'nickname']})
	 * ```
	 */
	getGroupMembersAttributes(params: {
		/** The group ID. */
		groupId: string;
		/** The array of user IDs of group members whose custom attributes are retrieved. */
		userIds: UserId[];
		/** The array of keys of custom attributes to be retrieved. If you pass in an empty array or do not set this parameter, the SDK gets all custom attributes of these group members. */
		keys?: string[];
	}): Promise<AsyncResult<GroupTypes.GetGroupMembersAttributesResult>>;
}

import { AsyncResult, UserId, CommonRequestResult } from '../types/common';
export { GroupTypes, AsyncResult, UserId };
