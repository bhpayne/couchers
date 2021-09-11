import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import MessageUserButton from "features/profile/actions/MessageUserButton";
import { User } from "proto/api_pb";
import React from "react";
import { Route, Switch, useLocation, useParams } from "react-router-dom";
import { chatsRoute } from "routes";
import { service } from "service";
import users from "test/fixtures/users.json";
import wrapper from "test/hookWrapper";
import { MockedService } from "test/utils";

const setErrorMock = jest.fn();
const getDirectMessageMock = service.conversations
  .getDirectMessage as MockedService<
  typeof service.conversations.getDirectMessage
>;

describe("MessageUserButton", () => {
  beforeEach(() => {
    setErrorMock.mockClear();
  });

  it("isn't rendered if not friends", async () => {
    jest.spyOn(console, "error").mockReturnValueOnce(undefined);
    render(
      <MessageUserButton
        user={{ ...users[0], friends: User.FriendshipStatus.NOT_FRIENDS }}
        setMutationError={setErrorMock}
      />,
      { wrapper }
    );

    expect(screen.queryByRole("button")).toBeNull();
  });

  it("redirects to thread if dm exists", async () => {
    getDirectMessageMock.mockResolvedValueOnce(99);
    const user = { ...users[0], friends: User.FriendshipStatus.FRIENDS };
    const MockChatRoute = () => {
      const chatId = useParams<{ chatId?: string }>().chatId;
      return <>Group chat, id: {chatId}</>;
    };
    render(
      <Switch>
        <Route path={`${chatsRoute}/:chatId`}>
          <MockChatRoute />
        </Route>
        <Route>
          <MessageUserButton user={user} setMutationError={setErrorMock} />
        </Route>
      </Switch>,
      {
        wrapper,
      }
    );

    userEvent.click(screen.getByRole("button"));

    expect(await screen.findByText("Group chat, id: 99")).toBeVisible();
  });

  it("redirects to chat tab with state if dm doesn't exist", async () => {
    getDirectMessageMock.mockResolvedValueOnce(false);
    const user = { ...users[0], friends: User.FriendshipStatus.FRIENDS };
    const MockChatsRoute = () => {
      const createMessageToId = useLocation<{
        createMessageTo: User.AsObject;
      }>()?.state?.createMessageTo?.userId;
      return <>Group chats route, message to: {createMessageToId}</>;
    };
    render(
      <Switch>
        <Route path={chatsRoute}>
          <MockChatsRoute />
        </Route>
        <Route>
          <MessageUserButton user={user} setMutationError={setErrorMock} />
        </Route>
      </Switch>,
      {
        wrapper,
      }
    );

    userEvent.click(screen.getByRole("button"));

    expect(
      await screen.findByText(
        `Group chats route, message to: ${users[0].userId}`
      )
    ).toBeVisible();
  });
});
