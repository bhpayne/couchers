import {
  Checkbox,
  FormControl,
  FormControlLabel,
  makeStyles,
  Typography,
} from "@material-ui/core";
import { Autocomplete } from "@material-ui/lab";
import Alert from "components/Alert";
import Button from "components/Button";
import CircularProgress from "components/CircularProgress";
import PageTitle from "components/PageTitle";
import {
  ABOUT_HOME,
  ADDITIONAL,
  EDIT_HOME,
  GENERAL,
  HOSTING_PREFERENCES,
  HOUSE_RULES,
  HOUSEMATE_DETAILS,
  KID_DETAILS,
  LOCAL_AREA,
  MAX_GUESTS,
  PET_DETAILS,
  SAVE,
} from "features/constants";
import {
  parkingDetailsLabels,
  sleepingArrangementLabels,
  smokingLocationLabels,
} from "features/profile/constants";
import useUpdateHostingPreferences from "features/profile/hooks/useUpdateHostingPreferences";
import ProfileTextInput from "features/profile/ProfileTextInput";
import useCurrentUser from "features/userQueries/useCurrentUser";
import {
  ParkingDetails,
  SleepingArrangement,
  SmokingLocation,
} from "pb/api_pb";
import { useState } from "react";
import { Controller, useForm, UseFormMethods } from "react-hook-form";
import { HostingPreferenceData } from "service/index";

interface HostingPreferenceCheckboxProps {
  className: string;
  defaultValue: boolean;
  name: string;
  label: string;
  register: UseFormMethods<HostingPreferenceData>["register"];
}

function HostingPreferenceCheckbox({
  className,
  defaultValue,
  label,
  name,
  register,
}: HostingPreferenceCheckboxProps) {
  return (
    <FormControl className={className} margin="dense">
      <FormControlLabel
        control={<Checkbox color="primary" defaultChecked={defaultValue} />}
        label={label}
        name={name}
        inputRef={register}
      />
    </FormControl>
  );
}

const useStyles = makeStyles((theme) => ({
  alert: {
    marginBottom: theme.spacing(3),
  },
  buttonContainer: {
    display: "flex",
    justifyContent: "center",
    paddingTop: theme.spacing(1),
  },
  field: {
    [theme.breakpoints.up("md")]: {
      "& > .MuiInputBase-root": {
        width: 400,
      },
    },
    "& > .MuiInputBase-root": {
      width: "100%",
    },
  },
  form: {
    marginBottom: theme.spacing(2),
  },
  formControl: {
    display: "block",
  },
  preferenceSection: {
    paddingTop: theme.spacing(3),
  },
  checkboxContainer: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(180px, auto))",
    columnGap: theme.spacing(2),
  },
}));

export default function HostingPreferenceForm() {
  const classes = useStyles();
  const {
    updateHostingPreferences,
    status: updateStatus,
    reset: resetUpdate,
  } = useUpdateHostingPreferences();
  const { data: user } = useCurrentUser();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const {
    control,
    errors,
    register,
    handleSubmit,
  } = useForm<HostingPreferenceData>({
    mode: "onBlur",
  });

  const onSubmit = handleSubmit((data) => {
    resetUpdate();
    updateHostingPreferences({
      preferenceData: data,
      setMutationError: setErrorMessage,
    });
    window.scroll({ top: 0 });
  });

  return (
    <>
      <PageTitle>{EDIT_HOME}</PageTitle>
      {updateStatus === "success" ? (
        <Alert className={classes.alert} severity="success">
          Successfully updated hosting preference!
        </Alert>
      ) : updateStatus === "error" ? (
        <Alert className={classes.alert} severity="error">
          {errorMessage || "Unknown error"}
        </Alert>
      ) : null}
      {user ? (
        <form className={classes.form} onSubmit={onSubmit}>
          <Typography variant="h2">{HOSTING_PREFERENCES}</Typography>
          <div className={classes.checkboxContainer}>
            <HostingPreferenceCheckbox
              className={classes.formControl}
              defaultValue={!!user.lastMinute?.value}
              label="Last-minute requests OK"
              name="lastMinute"
              register={register}
            />
            <HostingPreferenceCheckbox
              className={classes.formControl}
              defaultValue={!!user.wheelchairAccessible?.value}
              label="Wheelchair accessible"
              name="wheelchairAccessible"
              register={register}
            />
            <HostingPreferenceCheckbox
              className={classes.formControl}
              defaultValue={!!user.campingOk?.value}
              label="Camping OK"
              name="campingOk"
              register={register}
            />
            <HostingPreferenceCheckbox
              className={classes.formControl}
              defaultValue={!!user.acceptsKids?.value}
              label="Children OK"
              name="acceptsKids"
              register={register}
            />
            <HostingPreferenceCheckbox
              className={classes.formControl}
              defaultValue={!!user.acceptsPets?.value}
              label="Pets OK"
              name="acceptsPets"
              register={register}
            />
            <HostingPreferenceCheckbox
              className={classes.formControl}
              defaultValue={!!user.drinkingAllowed?.value}
              label="Drinking OK"
              name="drinkingAllowed"
              register={register}
            />
          </div>
          <Controller
            control={control}
            defaultValue={user.maxGuests?.value ?? null}
            name="maxGuests"
            render={({ onChange }) => (
              <Autocomplete
                disableClearable={false}
                defaultValue={user.maxGuests?.value}
                forcePopupIcon
                freeSolo
                getOptionLabel={(option) => option.toString()}
                options={[1, 2, 3, 4, 5]}
                onChange={(e, value) => onChange(value)}
                multiple={false}
                renderInput={(params) => (
                  <ProfileTextInput
                    {...params}
                    error={!!errors?.maxGuests?.message}
                    helperText={errors?.maxGuests?.message}
                    label={MAX_GUESTS}
                    name="maxGuests"
                    onChange={(e) => onChange(Number(e.target.value))}
                    className={classes.field}
                  />
                )}
              />
            )}
            rules={{
              validate: (value) =>
                isNaN(value) ? "Invalid number provided" : true,
            }}
          />
          <Controller
            control={control}
            defaultValue={user.smokingAllowed}
            name="smokingAllowed"
            render={({ onChange }) => (
              <Autocomplete
                disableClearable={false}
                defaultValue={user.smokingAllowed}
                forcePopupIcon
                freeSolo={false}
                getOptionLabel={(option) => smokingLocationLabels[option]}
                multiple={false}
                options={[
                  SmokingLocation.SMOKING_LOCATION_YES,
                  SmokingLocation.SMOKING_LOCATION_WINDOW,
                  SmokingLocation.SMOKING_LOCATION_OUTSIDE,
                  SmokingLocation.SMOKING_LOCATION_NO,
                ]}
                onChange={(e, value) =>
                  onChange(value ?? SmokingLocation.SMOKING_LOCATION_UNKNOWN)
                }
                renderInput={(params) => (
                  <ProfileTextInput
                    {...params}
                    label="Smoking allowed?"
                    name="smokingAllowed"
                    className={classes.field}
                  />
                )}
              />
            )}
          />
          <Typography variant="h2">{ABOUT_HOME}</Typography>
          <Controller
            control={control}
            defaultValue={user.sleepingArrangement}
            name="sleepingArrangement"
            render={({ onChange }) => (
              <Autocomplete
                disableClearable={false}
                defaultValue={user.sleepingArrangement}
                forcePopupIcon
                freeSolo={false}
                getOptionLabel={(option) => sleepingArrangementLabels[option]}
                multiple={false}
                options={[
                  SleepingArrangement.SLEEPING_ARRANGEMENT_PRIVATE,
                  SleepingArrangement.SLEEPING_ARRANGEMENT_COMMON,
                  SleepingArrangement.SLEEPING_ARRANGEMENT_SHARED_ROOM,
                  SleepingArrangement.SLEEPING_ARRANGEMENT_SHARED_SPACE,
                ]}
                onChange={(e, value) =>
                  onChange(
                    value ??
                      SleepingArrangement.SLEEPING_ARRANGEMENT_UNSPECIFIED
                  )
                }
                renderInput={(params) => (
                  <ProfileTextInput
                    {...params}
                    label="Sleeping arrangement"
                    name="sleepingArrangement"
                    className={classes.field}
                  />
                )}
              />
            )}
          />
          <div className={classes.checkboxContainer}>
            <div>
              <HostingPreferenceCheckbox
                className={classes.formControl}
                defaultValue={!!user.hasHousemates?.value}
                label="Housemates"
                name="hasHousemates"
                register={register}
              />
              <ProfileTextInput
                id="housemateDetails"
                label={HOUSEMATE_DETAILS}
                name="housemateDetails"
                defaultValue={user.housemateDetails?.value ?? ""}
                inputRef={register}
                rowsMax={5}
                multiline
                className={classes.field}
              />
            </div>
            <div>
              <HostingPreferenceCheckbox
                className={classes.formControl}
                defaultValue={!!user.hasKids?.value}
                label="Children"
                name="hasKids"
                register={register}
              />
              <ProfileTextInput
                id="kidDetails"
                label={KID_DETAILS}
                name="kidDetails"
                defaultValue={user.kidDetails?.value ?? ""}
                inputRef={register}
                rowsMax={5}
                multiline
                className={classes.field}
              />
            </div>
            <div>
              <HostingPreferenceCheckbox
                className={classes.formControl}
                defaultValue={!!user.hasPets?.value}
                label="Pets"
                name="hasPets"
                register={register}
              />
              <ProfileTextInput
                id="petDetails"
                label={PET_DETAILS}
                name="petDetails"
                defaultValue={user.petDetails?.value ?? ""}
                inputRef={register}
                rowsMax={5}
                multiline
                className={classes.field}
              />
            </div>
            <div>
              <HostingPreferenceCheckbox
                className={classes.formControl}
                defaultValue={!!user.parking?.value}
                label="Parking available"
                name="parking"
                register={register}
              />
              <Controller
                control={control}
                defaultValue={user.parkingDetails}
                name="parkingDetails"
                render={({ onChange }) => (
                  <Autocomplete
                    disableClearable={false}
                    defaultValue={user.parkingDetails}
                    forcePopupIcon
                    freeSolo={false}
                    getOptionLabel={(option) => parkingDetailsLabels[option]}
                    multiple={false}
                    options={[
                      ParkingDetails.PARKING_DETAILS_FREE_ONSITE,
                      ParkingDetails.PARKING_DETAILS_FREE_OFFSITE,
                      ParkingDetails.PARKING_DETAILS_PAID_ONSITE,
                      ParkingDetails.PARKING_DETAILS_PAID_OFFSITE,
                    ]}
                    onChange={(e, value) =>
                      onChange(
                        value ?? ParkingDetails.PARKING_DETAILS_UNSPECIFIED
                      )
                    }
                    renderInput={(params) => (
                      <ProfileTextInput
                        {...params}
                        label="Parking details"
                        name="parkingDetails"
                        className={classes.field}
                      />
                    )}
                  />
                )}
              />
            </div>
            <HostingPreferenceCheckbox
              className={classes.formControl}
              defaultValue={!!user.drinksAtHome?.value}
              label="Drinks at home"
              name="drinksAtHome"
              register={register}
            />
            <HostingPreferenceCheckbox
              className={classes.formControl}
              defaultValue={!!user.smokesAtHome?.value}
              label="Smokes at home"
              name="smokesAtHome"
              register={register}
            />
          </div>
          <Typography variant="h2">{GENERAL}</Typography>
          <ProfileTextInput
            id="area"
            label={LOCAL_AREA}
            name="area"
            defaultValue={user.area?.value ?? ""}
            inputRef={register}
            rowsMax={5}
            multiline
            className={classes.field}
          />
          <ProfileTextInput
            id="houseRules"
            label={HOUSE_RULES}
            name="houseRules"
            defaultValue={user.houseRules?.value ?? ""}
            inputRef={register}
            rowsMax={5}
            multiline
            className={classes.field}
          />
          <ProfileTextInput
            id="otherHostInfo"
            label={ADDITIONAL}
            name="otherHostInfo"
            defaultValue={user.otherHostInfo?.value ?? ""}
            inputRef={register}
            rowsMax={5}
            multiline
            className={classes.field}
          />
          <div className={classes.buttonContainer}>
            <Button
              type="submit"
              variant="contained"
              color="primary"
              onClick={onSubmit}
            >
              {SAVE}
            </Button>
          </div>
        </form>
      ) : (
        <CircularProgress />
      )}
    </>
  );
}
